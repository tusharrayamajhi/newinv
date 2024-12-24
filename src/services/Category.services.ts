import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCategoryDto } from "src/dtos/createCategory.dtos";
import { Category } from "src/entities/Category.entities";
import { returnObj } from "src/utils/returnObj";
import { Equal, Repository } from "typeorm";

@Injectable()
export class categoryService{
    
    
    constructor(
        @InjectRepository(Category) private readonly categoryRepo:Repository<Category>
    ){}

    async createCategory(req:any, categoryDto: CreateCategoryDto) {
        try{
            const category = await this.categoryRepo.findOne({where:{name:Equal(categoryDto.name),company:Equal(req.user.company)}});
            if(category){
                throw new HttpException("category already exists ",HttpStatus.FOUND)
            }
            const result = await this.categoryRepo.save(this.categoryRepo.create({...categoryDto,company:req.user.company,createdBy:req.user.id}));
            if(!result){
                throw new HttpException("cannot save category",HttpStatus.CONFLICT)
            }
            return returnObj(HttpStatus.OK,"save successfully",result)
        }catch(err){
            if(err instanceof HttpException){
                throw err;
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getCategories(req:any) {
        try{
            const categories = await this.categoryRepo.find({ where: { company: Equal(req.user.company) } });
            return returnObj(HttpStatus.OK, "categories retrieved successfully", categories);
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}