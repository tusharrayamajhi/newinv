import { Roles } from './../entities/Roles.entities';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entities/user.entities";
import { Equal, Repository } from "typeorm";
import { AddUsersDto } from "src/dtos/addUser.dtos";
import { Companies } from 'src/entities/Company.entities';
import { Permission } from 'src/entities/permission.entites';
import * as bcrypt from 'bcrypt'
import { returnObj } from 'src/utils/returnObj';
import { roles } from 'src/object/roles.object';
import { baseUpdateUserDto} from 'src/dtos/updateUser.dtos';

@Injectable()
export class UserService{
    
    
   
   
    constructor(
        @InjectRepository(Users) private readonly UserRepo:Repository<Users>,
        @InjectRepository(Roles) private readonly RolesRepo:Repository<Roles>,
        @InjectRepository(Companies) private readonly companyRepo:Repository<Companies>,
        @InjectRepository(Permission) private readonly PermissionRepo:Repository<Permission>,
    ){}
    

    async addUser(req:any,data: AddUsersDto) {
        try{
            if(req.user.role == roles.SuperAdmin){
                const user = await this.UserRepo.findOne({where:{email:Equal(data.email)}})
                if(user){
                    throw new HttpException("email already in used",HttpStatus.CONFLICT)
                }
                let role = {};
                let company = {}
                if(data.roles){
                    role = await this.RolesRepo.findOne({where:{id:Equal(data.roles),company:Equal(req.user.company)}})
                    if(!role){
                        throw new HttpException("role not found",HttpStatus.NOT_FOUND)
                    }
                }
                if(data.company){
                    company = await this.companyRepo.findOne({where:{id:Equal(data.company)}})
                    if(!company){
                        throw new HttpException("company not found",HttpStatus.NOT_FOUND)
                    }
                }
                const hashPassword = await bcrypt.hash(data.password,10)
                data.password = hashPassword
                const createUser = this.UserRepo.create({...data,roles:role,company:company,createdBy:req.user.id})
                const result = await this.UserRepo.save(createUser)
                if(!result){
                    throw new HttpException("cannot save user",HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK,"user created",result)
            }else if(req.user.role == roles.Admin){
                const user = await this.UserRepo.findOne({where:{email:Equal(data.email)}})
                if(user){
                    throw new HttpException("user email already exists",HttpStatus.CONFLICT)
                }
                let role = {};
                if(data.roles){
                    role = await this.RolesRepo.findOne({where:{id:Equal(data.roles),company:Equal(req.user.company)}})
                    if(!role){
                        throw new HttpException("role not found",HttpStatus.NOT_FOUND)
                    }
                }
                const hashPassword = await bcrypt.hash(data.password,10)
                data.password = hashPassword
                const createUser = this.UserRepo.create({...data,roles:role,company:req.user.company,createdBy:req.user.id})
                const result = await this.UserRepo.save(createUser)
                if(!result){
                    throw new HttpException("cannot save user",HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK,"user created",result)
            }else{
                throw new HttpException("you have no permission to create user",HttpStatus.UNAUTHORIZED)
            }
        }catch(err){
            console.log(err)
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getUsers(req: any) {
        try{
            if(req.user.role == roles.SuperAdmin){
                const users = await this.UserRepo.find()
                return returnObj(HttpStatus.OK,"success",users)
            }else if(req.user.role == roles.Admin){
                const users = await this.UserRepo.find({where:{company:Equal(req.user.company)}})
                return returnObj(HttpStatus.OK,"success",users)
            }else{
                throw new HttpException("you are not authorize",HttpStatus.FORBIDDEN)
            }
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async getUserById(req: any,id:string) {
        try{
            if(req.user.role == roles.SuperAdmin){
                const user = await this.UserRepo.findOne({where:{id:Equal(id)}})
                if(!user){
                    throw new HttpException("user not found",HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK,"success",user)
            }else if(req.user.role == roles.Admin){
                const user = await this.UserRepo.findOne({where:{id:Equal(id),company:Equal(req.user.company)}})
                if(!user){
                    throw new HttpException("user not found",HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK,"success",user)
            }else{
                throw new HttpException("you are not authorize",HttpStatus.FORBIDDEN)
            }
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async getUsersByCompany(req:any,id:string) {
        try{
            if(req.user.role == roles.SuperAdmin){
                const company = await this.companyRepo.findOne({where:{id:Equal(id)}})
                if(!company){
                    throw new HttpException("invalid company id",HttpStatus.NOT_FOUND)
                }
                const users = await this.UserRepo.find({where:{company:Equal(id)}})
                return returnObj(HttpStatus.OK,"success",users)
            }else{
                throw new HttpException("you are not authorize",HttpStatus.FORBIDDEN)
            }
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    

    async getUsersByRole(req: any,id:string) {
        try{
            if(req.user.role == roles.SuperAdmin){
                const role = await this.RolesRepo.findOne({where:{id:Equal(id)}})
                if(!role){
                    throw new HttpException("invalid role id",HttpStatus.NOT_FOUND)
                }
                const users = await this.UserRepo.find({where:{roles:Equal(id)}})
                if(!users || users.length == 0){
                    throw new HttpException("no user found",HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK,"success",users)
            }else if(req.user.role == roles.Admin){
                const role = await this.RolesRepo.findOne({where:{id:Equal(id)}})
                if(!role){
                    throw new HttpException("invalid role id",HttpStatus.NOT_FOUND)
                }
                const user = await this.UserRepo.find({where:{roles:Equal(id),company:Equal(req.user.company)}})
                if(!user || user.length == 0){
                    throw new HttpException("no user found",HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK,"success",user)
            }
            else{
                throw new HttpException("you are not authorize",HttpStatus.FORBIDDEN)
            }
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateUser(req: any,id:string,data:baseUpdateUserDto) {
        try{
            console.log(data)
            if(req.user.role == roles.SuperAdmin){
                const user = await this.UserRepo.findOne({where:{id:Equal(id)}})
                if(!user){
                    throw new HttpException("user not found",HttpStatus.NOT_FOUND)
                }
                if(data.roles){
                    const role = await this.RolesRepo.findOne({where:{id:Equal(data.roles)}})
                    if(!role){
                        throw new HttpException("role not found",HttpStatus.NOT_FOUND)
                    }
                    user.roles = role
                }
                if(data.company){
                    const company = await this.companyRepo.findOne({where:{id:Equal(data.company)}})
                    if(!company){
                        throw new HttpException("company not found",HttpStatus.NOT_FOUND)
                    }
                    user.company = company
                }
                console.log(user)
                Object.assign(user,data)
                const result = await this.UserRepo.save(user)
                if(!result){
                    throw new HttpException("cannot update user",HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK,"update successfully",result)
            }else if(req.user.role == roles.Admin){
                const user = await this.UserRepo.findOne({where:{id:Equal(id)}})
                if(!user){
                    throw new HttpException("user not found",HttpStatus.NOT_FOUND)
                }
                if(data.roles){
                    const role = await this.RolesRepo.findOne({where:{id:Equal(data.roles),company:Equal(req.user.company)}})
                    if(!role){
                        throw new HttpException("role not found",HttpStatus.NOT_FOUND)
                    }
                    user.roles = role
                }
                Object.assign(user,data)
                const result = await this.UserRepo.save(user)
                if(!result){
                    throw new HttpException("cannot update user",HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK,"update successfully",result)
                
            }
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteUser(req: any, id: string) {
        try{
            if(req.user.role == roles.SuperAdmin){
                const user = await this.UserRepo.findOne({where:{id:id}})
                if(!user){
                    throw new HttpException("user not found",HttpStatus.NOT_FOUND)
                }
                const result = await this.UserRepo.delete(id)
                if(!result){
                    throw new HttpException("cannot delete user",HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK,"delete successfully",result)
            }else if(req.user.role == roles.Admin){
                const user = await this.UserRepo.findOne({where:{id:id}})
                if(!user){
                    throw new HttpException("user not found",HttpStatus.NOT_FOUND)
                }
                const result = await this.UserRepo.delete(id)
                if(!result){
                    throw new HttpException("cannot delete user",HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK,"delete successfully",result)
            }
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            if (err.code === 'ER_ROW_IS_REFERENCED_2') { // MySQL foreign key constraint error code
                throw new HttpException(
                    "Cannot delete user because it is linked to other records",
                    HttpStatus.CONFLICT
                );
            }
            throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
   

}