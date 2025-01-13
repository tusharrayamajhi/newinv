import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards, ValidationPipe} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Permission } from "src/decorator/Permission.decorator";
import { CreateCategoryDto } from "src/dtos/createDtos/createCategory.dtos";
import { UpdateCategoryDto } from "src/dtos/updateDtos/updateCategoryDto";
import { havePermissionGuards } from "src/guards/havePermission.guards";
import { permissions } from "src/object/permission.object";
import { categoryService } from "src/services/Category.services";
import { swaggerUser } from "src/swagger/swagger.user";
import { swaggerController } from "src/swagger/swaggercontroller";

//swagger
@ApiTags(swaggerUser.other+swaggerController.category,swaggerUser.admin+swaggerController.category,swaggerUser.superAdmin+swaggerController.category)
@ApiBearerAuth("jwt")
//code
@Controller('category')
export class CategoryController {
    
    constructor(
        private readonly categoryService: categoryService
    ) { }

    @Post()
    @Permission(permissions.create_category)
    @UseGuards(havePermissionGuards)
    async createCategory(@Req() req:Request,@Body(new ValidationPipe({ whitelist: true })) categoryDto: CreateCategoryDto) {
        return await this.categoryService.createCategory(req,categoryDto);
    }

    @Get()
    @Permission(permissions.view_category)
    @UseGuards(havePermissionGuards)
    async getCategories(@Req() req:Request,@Query('page') page:number = 0) {
        return await this.categoryService.getCategories(req,page);
    }

    @Get("company/:companyId")
    @Permission(permissions.view_category)
    @UseGuards(havePermissionGuards)
    async getCategoriesByCompanyId(@Req() req: Request,@Query('page') page:number = 0, @Param("companyId", new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.FORBIDDEN })) companyId: string) {
        return await this.categoryService.getCategoriesByCompanyId(req, companyId,page);
    }
    

    @Get(":id")
    @Permission(permissions.view_category)
    @UseGuards(havePermissionGuards)
    async getCategoryById(@Req() req:Request,@Param("id",new ParseUUIDPipe({errorHttpStatusCode:HttpStatus.FORBIDDEN})) id: string) {
        return await this.categoryService.getCategoryById(req,id);
    }

    @Patch(":id")
    @Permission(permissions.update_category)
    @UseGuards(havePermissionGuards)
    async updateCategory(@Req() req:Request,@Param("id", new ParseUUIDPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE})) id: string, @Body(new ValidationPipe({ whitelist: true })) categoryDto: UpdateCategoryDto) {
        return await this.categoryService.updateCategory(req,id, categoryDto);
    }

    @Delete(":id")
    @Permission(permissions.delete_category)
    @UseGuards(havePermissionGuards)
    async deleteCategory(@Req() req:Request,@Param("id",new ParseUUIDPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE})) id: string) {
        return await this.categoryService.deleteCategory(req,id);
    }

}