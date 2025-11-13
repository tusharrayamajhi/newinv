import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePermissionDto } from "src/dtos/createDtos/addPermission.dtos";
import { Companies } from "src/entities/Company.entities";
import { Permission } from "src/entities/permission.entites";
import { Roles } from "src/entities/Roles.entities";
import { Users } from "src/entities/user.entities";
import { roles } from "src/object/roles.object";
import { returnObj } from "src/utils/returnObj";
import { Equal, In, Repository } from "typeorm";

@Injectable()
export class PermissionService{
    
    
    constructor(
        @InjectRepository(Permission) private readonly PermissionRepo:Repository<Permission>,
        @InjectRepository(Users) private readonly UserRepo:Repository<Users>,
        @InjectRepository(Roles) private readonly RolesRepo:Repository<Roles>,

    ){}

    async postPermission(req:any,data: CreatePermissionDto) {
        try{
            const permission = await this.PermissionRepo.findOne({where:{name:Equal(data.name)}})
            if(permission){
                throw new HttpException("permission already exists",HttpStatus.FOUND)
            }
            const result = await this.PermissionRepo.save({...data,createdBy:req.user.id})
            if(!result){
                throw new HttpException("cannot save permission",HttpStatus.CONFLICT)
            }
            return returnObj(HttpStatus.OK,"save successfully",result)
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllPermission() {
        try{
            const permission = await this.PermissionRepo.find()
            return returnObj(HttpStatus.OK,"success",permission)
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getPermissionByRole(role: string,req:any) {
        try{
            if(req.user.role == roles.SuperAdmin){
                const permission = await this.RolesRepo.findOne({where:{id:Equal(role)},relations:{permission:true}})
                if(!permission){
                    throw new HttpException("invalid role id",HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK,"success",permission.permission)
            }else if(req.user.role == roles.Admin){
                const permission = await this.RolesRepo.findOne({where:{id:Equal(role),company:Equal(req.user.company)},relations:{permission:true}})
                if(!permission){
                    throw new HttpException("invalid role id",HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK,"success",permission.permission)
            
            }
            else{
                const permission = await this.RolesRepo.findOne({where:{name:Equal(req.user.role),company:Equal(req.user.company)},relations:{permission:true}})
                if(!permission){
                    throw new HttpException("invalid role id",HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK,"success",permission.permission)
            }
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async havePermission(user:any,permission:string[]){
        try{
            const users = await this.UserRepo.findOne({where:{id:Equal(user.id)},relations:{company:true}})
            if(!users){
                return false
            }
            const roles = await this.RolesRepo.findOne({where:{name:Equal(user.role),company:Equal(users.company.id)},relations:{permission:true}})
            if(!roles){
                return false
            }
            const permissions = await this.PermissionRepo.find({ where: { name: In(permission) } });
            if(!permissions || permissions.length == 0){
                return false
            }
            const rolePermissions = roles.permission.map(p => p.name);
            return permission.every(p => rolePermissions.includes(p));
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}