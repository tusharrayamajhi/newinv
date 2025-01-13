import { roles } from './../object/roles.object';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from '../entities/permission.entites';
import { Roles } from "../entities/Roles.entities";
import { Users } from '../entities/user.entities';
import { returnObj } from "../utils/returnObj";
import { Equal, In, Repository } from "typeorm";
import { Companies } from '../entities/Company.entities';
import { CreateRoleDto } from 'src/dtos/createDtos/addRoles.dtos';
import { UpdateRoleDto } from 'src/dtos/updateDtos/updateRole.dtos';

@Injectable()
export class RolesService {
    
   
    

    constructor(
        @InjectRepository(Roles) private readonly RolesRepo: Repository<Roles>,
        @InjectRepository(Permission) private readonly PermissionRepo: Repository<Permission>,
        @InjectRepository(Users) private readonly userRepo:Repository<Users>,
        @InjectRepository(Companies) private readonly companyRepo:Repository<Companies>
    ) { }

    async addRoles(req: any, createRoleDto: CreateRoleDto) {
        try {
            if(createRoleDto.name == roles.SuperAdmin || createRoleDto.name == roles.Admin){
                throw new HttpException('invalid role name',HttpStatus.FORBIDDEN)
            }
            let permissions : Permission[] = []
            let company : Companies | null = null;
            let finalRole : Roles | null = null;
            if(req.user.role == roles.SuperAdmin){
                company = await this.companyRepo.findOne({where:{id:Equal(createRoleDto.companyId)}});
                if(!company){
                    throw new HttpException("invalid company id",HttpStatus.CONFLICT)
                }
                const role = await this.RolesRepo.findOne({where:{name:Equal(createRoleDto.name),company:Equal(createRoleDto.companyId)}})
                if(role){
                    throw new HttpException("role already exists in the company", HttpStatus.CONFLICT)
                }
                if(createRoleDto.permission && createRoleDto.permission.length != 0){
                    permissions = await this.PermissionRepo.find({where:{id:In(createRoleDto.permission)}})
                    if(permissions.length != createRoleDto.permission.length){
                        throw new HttpException("permission not found",HttpStatus.NOT_FOUND)
                    }
                }
                finalRole = this.RolesRepo.create({...createRoleDto,permission:permissions,company:company,createdBy:req.user.id})

            }else if(req.user.role == roles.Admin){

                company = await this.companyRepo.findOne({where:{id:Equal(createRoleDto.companyId)}});
                if(!company){
                    throw new HttpException("invalid company id",HttpStatus.CONFLICT)
                }
                const user = await this.userRepo.findOne({where:{id:Equal(req.user.id),company:Equal(createRoleDto.companyId)}})
                if(!user){
                    throw new HttpException("you have no authority to add a role in other company",HttpStatus.UNAUTHORIZED)
                }
                const role = await this.RolesRepo.findOne({where:{name:Equal(createRoleDto.name),company:Equal(createRoleDto.companyId)}});
                if(role){
                    throw new HttpException("roles already exists",HttpStatus.CONFLICT) 
                }
                if(createRoleDto.permission){
                     permissions = await this.PermissionRepo.find({where:{id:In(createRoleDto.permission)}})
                    if(permissions.length != createRoleDto.permission.length){
                        throw new HttpException("permission not found",HttpStatus.NOT_FOUND)
                    }
                }
                finalRole = this.RolesRepo.create({...createRoleDto,permission:permissions,company:company,createdBy:req.user.id})
            }
            const result = await this.RolesRepo.save(finalRole)
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


    async getRoles(req: any,page:number) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const roles = await this.RolesRepo.find({skip:page * 10,take:10,relations:{company:true,createdBy:true}})
                return returnObj(HttpStatus.OK, "success", roles)
            } else if (req.user.role == roles.Admin) {
                const companyId = (await this.userRepo.findOne({where:{id:Equal(req.user.id)},relations:{company:true}}))?.company?.id;
                if(!companyId){
                    throw new HttpException("this user don't belongs to give company",HttpStatus.NOT_ACCEPTABLE)
                }
                const roles = await this.RolesRepo.find({skip:page* 10,take:10,where:{company:Equal(companyId)}})
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
                const roles = await this.RolesRepo.findOne({ where: { id: Equal(id)}})
                if (!roles) {
                    throw new HttpException("roles not found", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", roles)
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
            if(updateRoleDto.name == roles.SuperAdmin || updateRoleDto.name == roles.Admin){
                throw new HttpException('invalid role name',HttpStatus.FORBIDDEN)
            }
            let company: Companies | null = null;
            let finalRole: Roles | null = null;
            let permissions: Permission[] = []
            if(req.user.role == roles.SuperAdmin){
                company = await this.companyRepo.findOne({where:{id:Equal(updateRoleDto.companyId)}})
                if(!company){
                    throw new HttpException("invalid company id",HttpStatus.NOT_FOUND)
                }
                const role = await this.RolesRepo.findOne({ where: { id: Equal(id), company: Equal(updateRoleDto.companyId) },relations:{permission:true} })
                if(!role){
                    throw new HttpException('give role not found in give company',HttpStatus.NOT_FOUND)
                }
                permissions = role.permission ? [...role.permission] : [];
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
                role.permission = permissions
                role.name = updateRoleDto.name ?? role.name
                role.description = updateRoleDto.description ?? role.description
                finalRole = role
            }else if(req.user.role == roles.Admin){
                const user = await this.userRepo.findOne({where:{id:Equal(req.user.id)},relations:{company:true}})
                if(!user){
                    throw new HttpException("no user found",HttpStatus.NOT_FOUND)
                }
                const role = await this.RolesRepo.findOne({ where: { id: Equal(id), company: Equal(user.company.id) },relations:{permission:true} })
                if (!role) {
                    throw new HttpException("roles not found", HttpStatus.NOT_FOUND)
                }
                permissions = role.permission ? [...role.permission] : [];
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
                role.permission = permissions
                role.name = updateRoleDto.name ?? role.name
                role.description = updateRoleDto.description ?? role.description
                finalRole = role
            }
               
                const result = await this.RolesRepo.save(finalRole)
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
            if (req.user.role == roles.SuperAdmin) {
                const role = await this.RolesRepo.findOne({ where: { id: Equal(id)},relations:{user:true}})
                if (!role) {
                    throw new HttpException("roles not found", HttpStatus.NOT_FOUND)
                }
                const result = await this.RolesRepo.remove(role)
                return returnObj(HttpStatus.OK, "delete successfully",result)
            } else if (req.user.role == roles.Admin) {
                const companyId = (await this.userRepo.findOne({where:{id:Equal(req.user.id)},relations:{company:true}}))?.company?.id
                const role = await this.RolesRepo.findOne({ where: { id: Equal(id), company:Equal(companyId) } })
                if (!role) {
                    throw new HttpException("roles not found", HttpStatus.NOT_FOUND)
                }
                const result = await this.RolesRepo.remove(role)
                if (!result) {
                    throw new HttpException("cannot delete roles", HttpStatus.INTERNAL_SERVER_ERROR)
                }
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
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getPermissionsByRoleId(req:  any, role_id: string) {
        try {
            let role: Roles | null = null;
            if (req.user.role == roles.SuperAdmin) {
                role = await this.RolesRepo.findOne({ where: { id: Equal(role_id) }, relations: { permission: true } });
            } else {
                const companyId = (await this.userRepo.findOne({where:{id:Equal(req.user.id)},relations:{company:true}}))?.company?.id

                if (!companyId) {
                    throw new HttpException('company not found', HttpStatus.BAD_REQUEST);
                }
                role = await this.RolesRepo.findOne({ where: { id: Equal(role_id), company: Equal(companyId) }, relations: { permission: true } });
            }
            if (!role) {
                throw new HttpException('invalid role id', HttpStatus.NOT_FOUND);
            }
            return returnObj(HttpStatus.OK, "success", role);
        } catch (err) {
            console.log(err);
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async haveRoles(id: any, role_id: any, company: any) {
        try{
            const user = await this.userRepo.findOne({where:{id:Equal(id),company:Equal(company)}})
            if(!user){
                return false
            }
            const role = await this.RolesRepo.findOne({where:{id:Equal(role_id),company:Equal(company)}})
            if(!role){
                return false
            }
            return true

        }catch(err){
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
                return returnObj(HttpStatus.OK,"success",permission)
            }else{
                const roleId = (await this.userRepo.findOne({where:{id:Equal(req.user.id)},relations:{roles:true}}))?.roles?.id
                const permission = (await this.RolesRepo.findOne({where:{id:Equal(roleId)},relations:{permission:true}}))?.permission
                return returnObj(HttpStatus.OK,"success",permission)
            }
        }catch(err){
            console.log(err)
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server eror",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}