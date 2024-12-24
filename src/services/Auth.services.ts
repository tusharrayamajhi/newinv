import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SignupDto } from "src/dtos/signup.dto";
import { Users } from "src/entities/user.entities";
import { returnObj } from "src/utils/returnObj";
import { Equal, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "src/dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class AuthService {
    
    
    constructor(
        @InjectRepository(Users) private userRepo: Repository<Users>,
        private jwtService:JwtService,
        @Inject(CACHE_MANAGER) private cacheManager:Cache 
    ) { }
    
    async signup(user_profile: Express.Multer.File, userSingnupDto: SignupDto) {
        try {
            const user = await this.userRepo.findOne({ where: { email: Equal(userSingnupDto.email) } });
            if (user) {
                throw new HttpException("email already in used",HttpStatus.CONFLICT)
            }
            console.log(user)
            userSingnupDto.password = await bcrypt.hash(userSingnupDto.password,10)
            const createUser = this.userRepo.create({...userSingnupDto, user_image: user_profile.filename });
            const result = await this.userRepo.save(createUser);
            if (!result) {
                throw new HttpException("cannot save user", HttpStatus.INTERNAL_SERVER_ERROR)
            }
            return returnObj(HttpStatus.CREATED, "signup save successfully contact to admin for further process", result);
            
        } catch (err) {
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async login(loginDto: LoginDto) {
        try{
            const user = await this.userRepo.findOne({where:{email:Equal(loginDto.email)},relations:{roles:true,company:true}});
            
            if(!user){
                throw new HttpException("invalid email id",HttpStatus.NOT_FOUND)
            }

            if(!bcrypt.compare(loginDto.password,user.password)){
                throw new HttpException("invalid password",HttpStatus.FORBIDDEN)
            }
            if(!user.is_active){
                throw new HttpException("you account is not active",HttpStatus.FORBIDDEN) 
            }
            if(!user.company){
                throw new HttpException("you have not assign any company",HttpStatus.FORBIDDEN) 
            }
            if(!user.roles){
                throw new HttpException("you have not assign any roles at",HttpStatus.FORBIDDEN)
            }

            const token = this.jwtService.sign({username:user.first_name + " " + user.middle_name + " " + user.last_name, id:user.id,role_id:user.roles.id,role:user.roles.name,company:user.company.id})
            await this.cacheManager.set(`token:${token}`,token);
            if(!token){
                throw new HttpException("something wrong in jwt token generate",HttpStatus.INTERNAL_SERVER_ERROR)
            }
            return returnObj(HttpStatus.OK,"login successfully",token)


        }catch(err){
            console.log(err)
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    async getMyProfile(req:any) {
        try{
            const user = await this.userRepo.findOne({where:{id:Equal(req.user.id)},relations:{company:true,roles:{permission:true}}})
            if(!user){
                throw new HttpException("not found",HttpStatus.NOT_FOUND)
            }
            return returnObj(HttpStatus.OK,"success",user) 
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}