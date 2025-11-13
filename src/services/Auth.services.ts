import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/user.entities";
import { returnObj } from "src/utils/returnObj";
import { Equal, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { SignupDto } from "src/dtos/createDtos/signup.dto";
import { LoginDto } from "src/dtos/createDtos/login.dto";
import { changeMyPassword } from "src/dtos/updateDtos/changePasswordDtos";
import { ChangeUserPasswordDto } from "src/dtos/updateDtos/changeUserPassword.dtos";
import { roles } from "src/object/roles.object";
import { forgetPasswordDto } from "src/dtos/createDtos/forgetPassword.dtos";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { generateOtp } from "src/utils/generateOtp";
import { changeForgetPasswordDto } from "src/dtos/createDtos/changeforgetPassword.Dto";
import { Companies } from "src/entities/Company.entities";
import { CreateCompanyDto } from "src/dtos/createDtos/addCompany.dtos";
import * as path from 'path';
import * as fs from 'fs';
import { Roles } from "src/entities/Roles.entities";
import { Permission } from "src/entities/permission.entites";
import { DataSource } from "typeorm";



@Injectable()
export class AuthService {


    constructor(
        @InjectQueue('opt_email') private readonly emailQueue: Queue,
        @InjectRepository(Users) private userRepo: Repository<Users>,
        @InjectRepository(Companies) private companyRepo: Repository<Companies>,
        @InjectRepository(Roles) private roleRepo: Repository<Roles>,
        @InjectRepository(Permission) private permissionRepo: Repository<Permission>,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private dataSource: DataSource
    ) {

    }

    async signup(userSignUpDto: SignupDto, companyDto: CreateCompanyDto) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const existingUser = await queryRunner.manager.findOne(Users, {
                where: { email: Equal(userSignUpDto.email) },
            });

            if (existingUser) {
                throw new HttpException('Email already in use', HttpStatus.CONFLICT);
            }

            const existingCompany = await queryRunner.manager.findOne(Companies, {
                where: { email: companyDto.data.email },
            });

            if (existingCompany) {
                throw new HttpException('Company email already exists', HttpStatus.BAD_REQUEST);
            }

            let userProfilePath: string | undefined;
            let companyLogoPath: string | undefined;

            if (userSignUpDto.user_profile?.originalname) {
                const fileName = `user_profile_${Date.now()}${path.extname(userSignUpDto.user_profile.originalname)}`;
                console.log(fileName)
                const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);
                fs.writeFileSync(filePath, userSignUpDto.user_profile.buffer);
                userProfilePath = `${fileName}`;
            }

            if (companyDto.company_logo?.originalname) {
                const fileName = `company_logo_${Date.now()}${path.extname(companyDto.company_logo.originalname)}`;
                const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);
                fs.writeFileSync(filePath, companyDto.company_logo.buffer);
                companyLogoPath = `${fileName}`;
            }

            const company = queryRunner.manager.create(Companies, {
                ...companyDto.data,
                company_logo: companyLogoPath,
            });
            await queryRunner.manager.save(company);

            const permissions = await this.permissionRepo.find();

            const adminRole = queryRunner.manager.create(Roles, {
                name: roles.Admin,
                company: company,
                permission: permissions,
                description: "this is admin role and has full access to the company",
            });
            await queryRunner.manager.save(adminRole);

            const hashedPassword = await bcrypt.hash(userSignUpDto.password, 10);

            const user = queryRunner.manager.create(Users, {
                ...userSignUpDto,
                password: hashedPassword,
                is_active: true,
                user_image: userProfilePath,
                company: company,
                roles: adminRole,
            });

            const savedUser = await queryRunner.manager.save(user);

            await queryRunner.commitTransaction();

            delete savedUser.password;

            return returnObj(HttpStatus.OK, "Signup saved successfully. Contact admin for further process.", savedUser);

        } catch (err) {
            await queryRunner.rollbackTransaction();

            if (err instanceof HttpException) {
                throw err;
            }

            throw new HttpException(err.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            await queryRunner.release();
        }
    }


    async login(loginDto: LoginDto) {
        try {
            const user = await this.userRepo.findOne({ where: { email: Equal(loginDto.email) }, relations: { roles: true, company: true } });
            if (!user) {
                throw new HttpException("invalid email id", HttpStatus.NOT_FOUND)
            }

            if (!(await bcrypt.compare(loginDto.password, user.password))) {
                throw new HttpException("invalid password", HttpStatus.FORBIDDEN)
            }
            if (!user.is_active) {
                throw new HttpException("you account is not active", HttpStatus.FORBIDDEN)
            }
            // if (!user.company) {
            //     throw new HttpException("you have not assign any company", HttpStatus.FORBIDDEN)
            // }
            // if (!user.roles) {
            //     throw new HttpException("you have not assign any roles at", HttpStatus.FORBIDDEN)
            // }

            const token = this.jwtService.sign({ username: user.first_name + " " + user.middle_name + " " + user.last_name, id: user.id,role:user.roles.name })
            await this.cacheManager.set(`token:${token}`, token);
            if (!token) {
                throw new HttpException("something wrong in jwt token generate", HttpStatus.INTERNAL_SERVER_ERROR)
            }
            return returnObj(HttpStatus.OK, "login successfully", token)


        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            return new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    async getMyProfile(req: any) {
        try {
            const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true, roles: { permission: true } } })
            if (!user) {
                throw new HttpException("not found", HttpStatus.NOT_FOUND)
            }
            delete user.password
            return returnObj(HttpStatus.OK, "success", user)
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async changePassword(changePassword: changeMyPassword, req: any) {
        try {
            const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) } });
            if (!user) {
                throw new HttpException("invalid user id", HttpStatus.NOT_FOUND)
            }
            if (!(await bcrypt.compare(changePassword.old_password, user.password))) {
                throw new HttpException("invalid password", HttpStatus.FORBIDDEN)
            }
            user.password = await bcrypt.hash(changePassword.new_password, 10);
            const result = await this.userRepo.save(user);
            if (!result) {
                throw new HttpException("cannot save password", HttpStatus.INTERNAL_SERVER_ERROR)
            }
            delete result.password
            return returnObj(HttpStatus.OK, "success fully change password", result)
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async changeUserPassword(changeUserPassword: ChangeUserPasswordDto, req: any) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const user = await this.userRepo.findOne({ where: { id: Equal(changeUserPassword.user_id) } });
                if (!user) {
                    throw new HttpException("invalid user id", HttpStatus.NOT_FOUND)
                }
                user.password = await bcrypt.hash(changeUserPassword.password, 10);
                const result = await this.userRepo.save(user);
                if (!result) {
                    throw new HttpException("cannot save password", HttpStatus.INTERNAL_SERVER_ERROR)
                }
                delete result.password
                return returnObj(HttpStatus.OK, "success fully change password", result)
            } else if (req.user.role == roles.Admin) {
                const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
                if (!user) {
                    throw new HttpException("invalid user id", HttpStatus.NOT_FOUND)
                }
                const newHashPassword = await bcrypt.hash(changeUserPassword.password, 10);
                user.password = newHashPassword;
                const result = await this.userRepo.save(user);
                if (!result) {
                    throw new HttpException("cannot save password", HttpStatus.INTERNAL_SERVER_ERROR)
                }
                delete result.password
                return returnObj(HttpStatus.OK, "success fully change password", result)
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async logout(req: any) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            await this.cacheManager.del(`token:${token}`);
            return returnObj(HttpStatus.OK, "logout successfully")
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async forgotPassword(forgetPasswordDto: forgetPasswordDto) {
        try {
            const user = await this.userRepo.findOne({ where: { email: Equal(forgetPasswordDto.email) } });
            if (!user) {
                throw new HttpException("invalid email", HttpStatus.NOT_FOUND)
            }
            const otp = generateOtp();
            await this.cacheManager.set(`otp:${forgetPasswordDto.email}`, otp, 120000);
            await this.emailQueue.add("forgetPasswordOtp", {
                email: forgetPasswordDto.email,
                otp: otp
            })

            return returnObj(HttpStatus.OK, `opt send to you email id :- ${forgetPasswordDto.email}`, { email: forgetPasswordDto.email })
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async changeForgetPassword(passwordDto: changeForgetPasswordDto) {
        try {
            const otp = await this.cacheManager.get(`otp:${passwordDto.email}`);
            if (otp != passwordDto.otp || !otp) {
                throw new HttpException("invalid otp", HttpStatus.NOT_FOUND)
            }
            const user = await this.userRepo.findOne({ where: { email: Equal(passwordDto.email) } })
            if (!user) {
                throw new HttpException('user not found', HttpStatus.NOT_FOUND)
            }
            const hashPassword = await bcrypt.hash(passwordDto.new_password, 10)
            user.password = hashPassword
            const result = await this.userRepo.save(user)
            if (!result) {
                throw new HttpException("something went wrong", HttpStatus.INTERNAL_SERVER_ERROR)
            }
            await this.cacheManager.del(`otp:${passwordDto.email}`)
            return { status: HttpStatus.OK, message: "password change successfully" }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}