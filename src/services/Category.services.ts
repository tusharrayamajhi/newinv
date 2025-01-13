import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCategoryDto } from "src/dtos/createDtos/createCategory.dtos";
import { UpdateCategoryDto } from "src/dtos/updateDtos/updateCategoryDto";
import { Category } from "src/entities/Category.entities";
import { Companies } from "src/entities/Company.entities";
import { Users } from "src/entities/user.entities";
import { roles } from "src/object/roles.object";
import { returnObj } from "src/utils/returnObj";
import { Equal, Repository } from "typeorm";

@Injectable()
export class categoryService{
    
    constructor(
        @InjectRepository(Category) private readonly categoryRepo:Repository<Category>,
        @InjectRepository(Companies) private readonly companyRepo:Repository<Companies>,
        @InjectRepository(Users) private readonly userRepo:Repository<Users>
    ){}

    async createCategory(req:any, categoryDto: CreateCategoryDto) {
        try{
            if(roles.SuperAdmin == req.user.role){
                let company : Companies | null = null
                if(categoryDto.companyId){
                    company = await this.companyRepo.findOne({where:{id:Equal(categoryDto.companyId)}})
                    if(!company){
                        throw new HttpException("invalid company id",HttpStatus.NOT_FOUND)
                    }
                    const category = await this.categoryRepo.findOne({where:{name:Equal(categoryDto.name),company:Equal(company.id)}})
                    if(category){
                        throw new HttpException(`${categoryDto.name} already exists in the company`,HttpStatus.CONFLICT)
                    }
                }

                const comp = this.categoryRepo.create({...categoryDto,company:company,createdBy:req.user.id})
                const result = await this.categoryRepo.save(comp)
                if(!result){
                    throw new HttpException("cannot save category",HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK,"success",result)
            }else{
                const company = (await this.userRepo.findOne({where:{id:Equal(req.user.id)},relations:{company:true}}))?.company
                if(!company){
                    throw new HttpException("company not found",HttpStatus.NOT_FOUND)
                }
                const category = await this.categoryRepo.findOne({where:{name:Equal(categoryDto.name),company:Equal(company.id)}});
                if(category){
                    throw new HttpException("category already exists ",HttpStatus.FOUND)
                }
                const result = await this.categoryRepo.save(this.categoryRepo.create({...categoryDto,company:company,createdBy:req.user.id}));
                if(!result){
                    throw new HttpException("cannot save category",HttpStatus.CONFLICT)
                }
                return returnObj(HttpStatus.OK,"save successfully",result)
            }
        }catch(err){
            if(err instanceof HttpException){
                throw err;
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getCategories(req:any,page:number) {
        try{
            if(roles.SuperAdmin == req.user.role){
                const categories = await this.categoryRepo.find({skip:page * 10,take:10,relations:{company:true}})
                if(!categories || categories.length == 0){
                    throw new HttpException("no category found",HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK,"success",categories)
            }else{
                const companyId = (await this.userRepo.findOne({where:{id:Equal(req.user.id)},relations:{company:true}}))?.company?.id
                if(!companyId){
                    throw new HttpException("company not found",HttpStatus.INTERNAL_SERVER_ERROR)
                }
                const categories = await this.categoryRepo.find({skip:page * 10,take:10, where: { company: Equal(companyId) } });
                if(!categories || categories.length == 0){
                    throw new HttpException("no category found",HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", categories);
            }
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getCategoryById(req: any,id: string) {
        try{
            if(roles.SuperAdmin == req.user.role){
                const category = await this.categoryRepo.findOne({where:{id:Equal(id)}})
                if(!category){
                    throw new HttpException("invalid category id",HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK,"success",category) 
            }else{
                const companyId = (await this.userRepo.findOne({where:{id:Equal(req.user.id)},relations:{company:true}}))?.company?.id
                if(!companyId){
                    throw new HttpException("company not found",HttpStatus.BAD_REQUEST)
                }
                const category = await this.categoryRepo.findOne({where:{id:Equal(id),company:Equal(companyId)}})
                if(!category){
                    throw new HttpException("invalid category id",HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK,"success",category) 
            }
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateCategory(req:any,id: string, categoryDto: UpdateCategoryDto) {
        try{
            if(roles.SuperAdmin == req.user.role){
                const category = await this.categoryRepo.findOne({where:{id:Equal(id)}});
                if(!category){
                    throw new HttpException('invalid category id',HttpStatus.NOT_FOUND);
                }
                if(categoryDto.companyId){
                    const company = await this.companyRepo.findOne({where:{id:Equal(categoryDto.companyId)}});
                    if(!company){
                        throw new HttpException("invalid company id",HttpStatus.NOT_FOUND);
                    }
                    const foundCategory = await this.categoryRepo.findOne({where:{name:Equal(categoryDto.name),company:Equal(company.id)}});
                    if(foundCategory){
                        throw new HttpException(`${categoryDto.name} already exists in the company`,HttpStatus.CONFLICT);
                    }
                    category.company = company;
                }
                Object.assign(category,categoryDto);
                const result = await this.categoryRepo.save(category);
                if(!result){
                    throw new HttpException("cannot update category",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return returnObj(HttpStatus.OK,"Success",result);
            }else{
                const company = (await this.userRepo.findOne({where:{id:Equal(req.user.id)},relations:{company:true}}))?.company
                if(!company){
                    throw new HttpException(" company not found",HttpStatus.INTERNAL_SERVER_ERROR)
                }
                const category = await this.categoryRepo.findOne({where:{id:Equal(id),company:Equal(company.id)}})
                if(!category){
                    throw new HttpException("invalid category id",HttpStatus.NOT_FOUND)
                }
                category.name = categoryDto.name ? categoryDto.name : category.name
                category.description = categoryDto.description ? categoryDto.description : category.description
                const result = await this.categoryRepo.save(category)
                if(!result){
                    throw new HttpException("cannot update category",HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK,"success",result)
            }
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async deleteCategory(req:any,id: string) {
        try{
            if(roles.SuperAdmin == req.user.role){
                const category = await this.categoryRepo.findOne({where:{id:Equal(id)}})
                if(!category){
                    throw new HttpException("invalid category id",HttpStatus.NOT_FOUND)
                }
                const result = await this.categoryRepo.remove(category)
                return returnObj(HttpStatus.OK,"success",result)
            }else{
                const companyId = (await this.userRepo.findOne({where:{id:Equal(req.user.id)},relations:{company:true}}))?.company?.id
                if(!companyId){
                    throw new HttpException("company not found",HttpStatus.NOT_FOUND)
                }
                const category = await this.categoryRepo.findOne({where:{id:Equal(id),company:Equal(companyId)}});
                if(!category){
                    throw new HttpException("invalid category id",HttpStatus.NOT_FOUND)
                }
                const deleted = await this.categoryRepo.remove(category)
                if(!deleted){
                    throw new HttpException("cannot delete category",HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK,"success",deleted)
            }
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException('internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getCategoriesByCompanyId(req: any, companyId: string,page:number) {
        try {
            if(roles.SuperAdmin == req.user.role){
                const company = await this.companyRepo.findOne({where:{id:Equal(companyId)}})
                if(!company){
                    throw new HttpException("invalid company id",HttpStatus.BAD_REQUEST)
                }
            }else{
                const company = (await this.userRepo.findOne({where:{id:Equal(req.user.id)},relations:{company:true}}))?.company?.id
                if(!company || company != companyId){
                    throw new HttpException("this user doesn't belong to give company",HttpStatus.FORBIDDEN)
                }
            }
            const categories = await this.categoryRepo.find({skip:page * 10,take:10, where: { company: Equal(companyId) } });
            if (!categories.length) {
                throw new HttpException("No categories found for the given company ID", HttpStatus.NOT_FOUND);
            }
            return returnObj(HttpStatus.OK, "categories retrieved successfully", categories);
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}