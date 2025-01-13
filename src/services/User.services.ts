import { returnObj } from 'src/utils/returnObj';
import { Roles } from './../entities/Roles.entities';
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entities/user.entities";
import { Equal, Repository } from "typeorm";
import { Companies } from 'src/entities/Company.entities';
import { Permission } from 'src/entities/permission.entites';
import * as bcrypt from 'bcrypt'
import { roles } from 'src/object/roles.object';
import { AddUsersDto } from 'src/dtos/createDtos/addUser.dtos';
import { baseUpdateUserDto } from 'src/dtos/updateDtos/updateUser.dtos';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { generateOtp } from 'src/utils/generateOtp';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {

    constructor(
        @InjectQueue("opt_email") private readonly sendEmail:Queue,
        @InjectRepository(Users) private readonly UserRepo: Repository<Users>,
        @InjectRepository(Roles) private readonly RolesRepo: Repository<Roles>,
        @InjectRepository(Companies) private readonly companyRepo: Repository<Companies>,
        @InjectRepository(Permission) private readonly PermissionRepo: Repository<Permission>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }


    async addUser(req: any, data: AddUsersDto) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const user = await this.UserRepo.findOne({ where: { email: data.email } })
                if (user) {
                    throw new HttpException("email already in used", HttpStatus.CONFLICT)
                }
                let role: Roles | null = null;
                let company: Companies | null = null;
                if (data.company) {
                    company = await this.companyRepo.findOne({ where: { id: data.company } })
                    if (!company) {
                        throw new HttpException("company not found", HttpStatus.NOT_FOUND)
                    }
                    if (data.roles) {
                        role = await this.RolesRepo.findOne({ where: { id: data.roles, company: Equal(data.company) } })
                        if (!role) {
                            throw new HttpException("role not found", HttpStatus.NOT_FOUND)
                        }
                    }
                }
                const hashPassword = await bcrypt.hash(data.password, 10)
                data.password = hashPassword
                const createUser = this.UserRepo.create({ ...data, roles: role, company: company, createdBy: req.user.id })
                const result = await this.UserRepo.save(createUser)
                if (!result) {
                    throw new HttpException("cannot save user", HttpStatus.INTERNAL_SERVER_ERROR)
                }
                delete result.password
                return returnObj(HttpStatus.OK, "user created", result)
            } else if (req.user.role == roles.Admin) {
                const user = await this.UserRepo.findOne({ where: { email: Equal(data.email) } })
                if (user) {
                    throw new HttpException("user email already exists", HttpStatus.CONFLICT)
                }
                let role: Roles | null = null;
                const company = (await this.UserRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND)
                }
                if (data.roles) {
                    role = await this.RolesRepo.findOne({ where: { id: Equal(data.roles), company: Equal(company.id) } })
                    if (!role) {
                        throw new HttpException("role not found", HttpStatus.NOT_FOUND)
                    }
                }
                const hashPassword = await bcrypt.hash(data.password, 10)
                data.password = hashPassword
                const createUser = this.UserRepo.create({ ...data, roles: role, company: company, createdBy: req.user.id })
                const result = await this.UserRepo.save(createUser)
                if (!result) {
                    throw new HttpException("cannot save user", HttpStatus.INTERNAL_SERVER_ERROR)
                }
                delete result.password
                return returnObj(HttpStatus.OK, "user created", result)
            } else {
                throw new HttpException("you have no permission to create user", HttpStatus.UNAUTHORIZED)
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllUsers(req: any,page:number) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const users = await this.UserRepo.find({skip:page * 10,take:10, relations: { company: true } });
                if (!users || users.length == 0) {
                    throw new HttpException("no user found", HttpStatus.NOT_FOUND)
                }
                users.forEach(user => delete user.password);
                return returnObj(HttpStatus.OK, "success", users)
            } else if (req.user.role == roles.Admin) {
                const companyId = (await this.UserRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company?.id
                if (!companyId) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND)
                }
                const users = await this.UserRepo.find({skip:page * 10,take:10, where: { company: Equal(companyId) } })
                if (!users || users.length == 0) {
                    throw new HttpException("no user found", HttpStatus.NOT_FOUND)
                }
                users.forEach(user => delete user.password);
                return returnObj(HttpStatus.OK, "success", users)
            } else {
                throw new HttpException("you are not authorize", HttpStatus.FORBIDDEN)
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async getUserById(req: any, id: string) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const user = await this.UserRepo.findOne({ where: { id: Equal(id) },relations:{company:true,roles:true}})
                if (!user) {
                    throw new HttpException("user not found", HttpStatus.NOT_FOUND)
                }
                delete user.password;
                return returnObj(HttpStatus.OK, "success", user)
            } else if (req.user.role == roles.Admin) {
                const companyId = (await this.UserRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company?.id;
                if (!companyId) {
                    throw new HttpException("Company id not found", HttpStatus.NOT_FOUND)
                }
                const user = await this.UserRepo.findOne({ where: { id: Equal(id), company: Equal(companyId)},relations:{roles:true}})
                if (!user) {
                    throw new HttpException("user not found", HttpStatus.NOT_FOUND)
                }
                delete user.password;
                
                return returnObj(HttpStatus.OK, "success", user)
            } else {
                throw new HttpException("you are not authorize", HttpStatus.FORBIDDEN)
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async getUsersByCompany(req: any, id: string,page:number) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const company = await this.companyRepo.findOne({ where: { id: Equal(id) } });
                if (!company) {
                    throw new HttpException("no company found", HttpStatus.NOT_FOUND)
                }
                const users = await this.UserRepo.find({skip:page * 10, take:10, where: { company: Equal(company.id) } })
                if (!users || users.length == 0) {
                    throw new HttpException("no user found", HttpStatus.NOT_FOUND)
                }
                users.forEach(user=>delete user.password)
                return returnObj(HttpStatus.OK, "success", users)
            } else if (req.user.role == roles.Admin) {
                const companyId = (await this.UserRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company?.id;
                if (companyId != id) {
                    throw new HttpException("this user doesn't belong to the given company", HttpStatus.FORBIDDEN)
                }
                const users = await this.UserRepo.find({skip:page * 10,take:10, where: { company: Equal(companyId) } })
                if (!users || users.length == 0) {
                    throw new HttpException("no user found", HttpStatus.NOT_FOUND)
                }
                users.forEach(user => delete user.password)
                return returnObj(HttpStatus.OK, "success", users)
            } else {
                throw new HttpException("you are not authorize", HttpStatus.FORBIDDEN)
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async getUsersByRole(req: any, id: string,page:number) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const role = await this.RolesRepo.findOne({ where: { id: Equal(id) } })
                if (!role) {
                    throw new HttpException("invalid role id", HttpStatus.NOT_FOUND)
                }
                const users = await this.UserRepo.find({skip:page*10,take:10, where: { roles: Equal(id) } })
                if (!users || users.length == 0) {
                    throw new HttpException("no user found", HttpStatus.NOT_FOUND)
                }
                users.forEach(user => delete user.password)
                return returnObj(HttpStatus.OK, "success", users)
            } else if (req.user.role == roles.Admin) {
                const companyId = (await this.UserRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company?.id
                if (!companyId) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND)
                }
                const role = await this.RolesRepo.findOne({ where: { id: Equal(id), company: Equal(companyId) } })
                if (!role) {
                    throw new HttpException("invalid role id", HttpStatus.NOT_FOUND)
                }
                const users = await this.UserRepo.find({skip:page * 10,take:10, where: { roles: Equal(id) } })
                if (!users || users.length == 0) {
                    throw new HttpException("no user found", HttpStatus.NOT_FOUND)
                }
                users.forEach(user => delete user.password)
                return returnObj(HttpStatus.OK, "success", users)
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateUser(req: any, id: string, data: baseUpdateUserDto) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const user = await this.UserRepo.findOne({ where: { id: Equal(id) } })
                if (!user) {
                    throw new HttpException("user not found", HttpStatus.NOT_FOUND)
                }
                if (data.company) {
                    const company = await this.companyRepo.findOne({ where: { id: Equal(data.company) } })
                    if (!company) {
                        throw new HttpException("company not found", HttpStatus.NOT_FOUND)
                    }
                    user.company = company
                    if (!data.roles) {
                        user.roles = null
                    }
                    if (data.roles) {
                        const role = await this.RolesRepo.findOne({ where: { id: Equal(data.roles), company: Equal(data.company) } })
                        if (!role) {
                            throw new HttpException("role not found", HttpStatus.NOT_FOUND)
                        }
                        user.roles = role
                    }
                }
                Object.assign(user, data)
                const result = await this.UserRepo.save(user)
                if (!result) {
                    throw new HttpException("cannot update user", HttpStatus.INTERNAL_SERVER_ERROR)
                }
                delete result.password
                return returnObj(HttpStatus.OK, "update successfully", result)
            } else if (req.user.role == roles.Admin) {

                const user = await this.UserRepo.findOne({ where: { id: Equal(id) } })
                if (!user) {
                    throw new HttpException("user not found", HttpStatus.NOT_FOUND)
                }
                const company = await (await this.UserRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND)
                }
                if (data.roles) {
                    const role = await this.RolesRepo.findOne({ where: { id: Equal(data.roles), company: Equal(company.id) } })
                    if (!role) {
                        throw new HttpException("role not found", HttpStatus.NOT_FOUND)
                    }
                    user.roles = role
                }
                Object.assign(user, data)
                const result = await this.UserRepo.save(user)
                if (!result) {
                    throw new HttpException("cannot update user", HttpStatus.INTERNAL_SERVER_ERROR)
                }
                delete result.password
                return returnObj(HttpStatus.OK, "update successfully", result)

            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteUser(req: any, id: string) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const user = await this.UserRepo.findOne({ where: { id: Equal(id) } })
                if (!user) {
                    throw new HttpException("user not found", HttpStatus.NOT_FOUND)
                }
                const result = await this.UserRepo.remove(user)
                if (!result) {
                    throw new HttpException("cannot delete user", HttpStatus.INTERNAL_SERVER_ERROR)
                }
                delete result.password
                return returnObj(HttpStatus.OK, "delete successfully", result)
            } else if (req.user.role == roles.Admin) {
                const companyId = (await this.UserRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company?.id
                if (!companyId) {
                    throw new HttpException("no company found", HttpStatus.NOT_FOUND)
                }
                const user = await this.UserRepo.findOne({ where: { id: Equal(id), company: Equal(companyId) } })
                if (!user) {
                    throw new HttpException("user not found", HttpStatus.NOT_FOUND)
                }
                const result = await this.UserRepo.remove(user)
                if (!result) {
                    throw new HttpException("cannot delete user", HttpStatus.INTERNAL_SERVER_ERROR)
                }
                delete result.password
                return returnObj(HttpStatus.OK, "delete successfully", result)
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            if (err.code === 'ER_ROW_IS_REFERENCED_2') { // MySQL foreign key constraint error code
                throw new HttpException(
                    "Cannot delete user because it is linked to other records",
                    HttpStatus.CONFLICT
                );
            }
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async sendVerifyEmail(req:any) {
        try{
            const user = await this.UserRepo.findOne({where:{id:Equal(req.user.id)}})
            if(!user){
                throw new HttpException("user not found",HttpStatus.NOT_FOUND)
            }
            if(user.is_verify_email){
                throw new HttpException("you are already verify",HttpStatus.OK)
            }
            const otp = generateOtp()
            this.cacheManager.set(`OTP:${user.email}`,otp,120000)
            this.sendEmail.add("send_verify_email_otp",{
                email:user.email,
                otp: otp
            })
            return {status:HttpStatus.OK,message:`OTP is sent to: ${user.email}`}
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async VerifyEmail(req: any, otp: number) {
        try{
            const user = await this.UserRepo.findOne({where:{id:Equal(req.user.id)}})
            if(!user){
                throw new HttpException("user not found",HttpStatus.NOT_FOUND)
            }
            if(user.is_verify_email){
                throw new HttpException('user already verify',HttpStatus.OK)
            }
            const OTP = await this.cacheManager.get(`OTP:${user.email}`)
            if(!OTP || OTP != otp){
                throw new HttpException("invalid otp",HttpStatus.NOT_FOUND)
            }
            user.is_verify_email = true
            const result = await this.UserRepo.save(user)
            await this.cacheManager.del(`OTP:${user.email}`);
            if(!result){
                throw new HttpException("something went wrong",HttpStatus.INTERNAL_SERVER_ERROR)
            }
            return {status:HttpStatus.OK,message:"email verified"}
        }catch(err){   
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}