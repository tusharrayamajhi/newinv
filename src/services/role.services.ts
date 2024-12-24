import { UpdateRoleDto } from './../dtos/updateRole.dtos';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoleDto } from "src/dtos/addRoles.dtos";
import { Permission } from 'src/entities/permission.entites';
import { Roles } from "src/entities/Roles.entities";
import { Users } from 'src/entities/user.entities';
import { roles } from "src/object/roles.object";
import { returnObj } from "src/utils/returnObj";
import { Equal, In, Repository } from "typeorm";

@Injectable()
export class RolesService {
    
   
    

    constructor(
        @InjectRepository(Roles) private readonly RolesRepo: Repository<Roles>,
        @InjectRepository(Permission) private readonly PermissionRepo: Repository<Permission>,
        @InjectRepository(Users) private readonly userRepo:Repository<Users>
    ) { }

    async addRoles(req: any, createRoleDto: CreateRoleDto) {
        try {
            const roles = await this.RolesRepo.find({where:{name:Equal(createRoleDto.name),company:Equal(req.user.company)}});
            console.log(roles)
            if(roles.length > 0){
                throw new HttpException("roles already exists",HttpStatus.BAD_REQUEST) 
            }
            let permissions = []
            if(createRoleDto.permission){
                 permissions = await this.PermissionRepo.find({where:{id:In(createRoleDto.permission)}})
                if(permissions.length != createRoleDto.permission.length){
                    throw new HttpException("permission not found",HttpStatus.NOT_FOUND)
                }
            }
            const finalrole = this.RolesRepo.create({...createRoleDto,permission:permissions,company:req.user.company,createdBy:req.user.id})
            const result = await this.RolesRepo.save(finalrole)
            if(!result){
                throw new HttpException("cannot save roles",HttpStatus.INTERNAL_SERVER_ERROR)
            }
            return returnObj(HttpStatus.OK,"success",result);
        } catch (err) {
            console.log(err)
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async getRoles(req: any) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const roles = await this.RolesRepo.find({relations:{company:true,createdBy:true}})
                return returnObj(HttpStatus.OK, "success", roles)
            } else if (req.user.role == roles.Admin) {
                console.log(req.user.company)
                const roles = await this.RolesRepo.find({where:{company:Equal(req.user.company)}});
                return returnObj(HttpStatus.OK, "success", roles)
            } else {
                throw new HttpException("you are not authorize", HttpStatus.FORBIDDEN)
            }
        } catch (err) {
            console.log(err)
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getRolesById(req: any, id: string) {
        try {
            // if (req.user.role == roles.SuperAdmin) {
            //     const roles = await this.RolesRepo.findOne({ where: { id: Equal(id) }, relations: { user: true, createdBy: true } })
            //     if (!roles) {
            //         throw new HttpException("roles not found", HttpStatus.NOT_FOUND)
            //     }
            //     return returnObj(HttpStatus.OK, "success", roles)
            // } else if (req.user.role == roles.Admin) {
                const roles = await this.RolesRepo.findOne({ where: { id: Equal(id), company:Equal(req.user.company)}})
                if (!roles) {
                    throw new HttpException("roles not found", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", roles)
            // }
        } catch (err) {
            console.log(err)
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateRoles(req: any, id: string, updateRoleDto: UpdateRoleDto) {
        try {
            console.log(updateRoleDto)
        
                const roles = await this.RolesRepo.findOne({ where: { id: Equal(id), company: Equal(req.user.company) },relations:{permission:true} })
                if (!roles) {
                    throw new HttpException("roles not found", HttpStatus.NOT_FOUND)
                }
                const permissions = roles.permission ? [...roles.permission] : [];
                if (updateRoleDto.permission) {
                    const newPermissions = await this.PermissionRepo.find({ where: { id: In(updateRoleDto.permission)} })
                    if (newPermissions.length != updateRoleDto.permission.length) {
                        throw new HttpException("permission not found", HttpStatus.NOT_FOUND)
                    }

                    const uniquePermissions = new Map();
                    permissions.concat(newPermissions).forEach(permission => {
                        uniquePermissions.set(permission.id, permission);
                    });
                    permissions.splice(0, permissions.length, ...uniquePermissions.values());
                    
                }
                roles.permission = permissions
                roles.name = updateRoleDto.name ?? roles.name
                roles.description = updateRoleDto.description ?? roles.description
                const result = await this.RolesRepo.save(roles)
                if (!result) {
                    throw new HttpException("cannot update roles", HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK, "update successfully", result)
            
        } catch (err) {
            console.log(err)
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async deleteRoles(req: any, id: string) {
        try {
            // if (req.user.role == roles.SuperAdmin) {
            //     const roles = await this.RolesRepo.findOne({ where: { id: Equal(id) }, relations: { user: true } })
            //     if (!roles) {
            //         throw new HttpException("roles not found", HttpStatus.NOT_FOUND)
            //     }
            //     const result = await this.RolesRepo.delete({ id: id })
            //     if (!result) {
            //         throw new HttpException("cannot delete roles", HttpStatus.INTERNAL_SERVER_ERROR)
            //     }
            //     return returnObj(HttpStatus.OK, "delete successfully", result)
            // } else if (req.user.role == roles.Admin) {
                const role = await this.RolesRepo.findOne({ where: { id: Equal(id), company:Equal(req.user.company) } })
                if (!role) {
                    throw new HttpException("roles not found", HttpStatus.NOT_FOUND)
                }
                const result = await this.RolesRepo.remove(role)
                if (!result) {
                    throw new HttpException("cannot delete roles", HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK, "delete successfully", result)
            // } else {
            //     throw new HttpException("you are not authorize", HttpStatus.FORBIDDEN)
            // }
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
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getPermissionsByRoleId(req:  any, role_id: string) {
        try{
            const role = await this.RolesRepo.findOne({where:{id:Equal(role_id),company:Equal(req.user.company)},relations:{permission:true}})
            if(!role){
                throw new HttpException('invalid role id',HttpStatus.NOT_FOUND)
            }
            return returnObj(HttpStatus.OK,"success",role)
        }catch(err){
            console.log(err)
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async haveRoles(id: any, role_id: any, company: any) {
        try{
            console.log("inside haverole")
            const user = await this.userRepo.findOne({where:{id:Equal(id),company:Equal(company)}})
            console.log(user)
            if(!user){
                return false
            }
            const role = await this.RolesRepo.findOne({where:{id:Equal(role_id),company:Equal(company)}})
            console.log(role)
            if(!role){
                return false
            }
            return true

        }catch(err){
            console.log("havepermission")
            console.log(err)
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException('internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getMyPermissions(req:any) {
        try{
            if(req.user.role == roles.SuperAdmin || req.user.role == roles.Admin){
                const permission = await this.PermissionRepo.find()
                console.log(permission)
                return returnObj(HttpStatus.OK,"success",permission)
            }else{
                const permission = await this.RolesRepo.find({where:{id:Equal(req.user.role_id),company:Equal(req.user.company)},relations:{permission:true}})
                return returnObj(HttpStatus.OK,"success",permission)
            }
        }catch(err){
            console.log("my permission")
            console.log(err)
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server eror",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}