import { Body, Controller, Get, Param, Post, Req, UseGuards, ValidationPipe} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Permission } from "src/decorator/Permission.decorator";
import { CreateCategoryDto } from "src/dtos/createCategory.dtos";
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
    async getCategories(@Req() req:Request) {
        return await this.categoryService.getCategories(req);
    }

    @Get(":id")
    @Permission(permissions.view_category)
    async getCategory(@Param("id") id: number) {
        return await this.categoryService.getCategories(id);
    }

    // @Post()
    // @Permission("create_category")
    // async createCategory(@Body(new ValidationPipe({ whitelist: true })) categoryDto: CategoryDto) {
    //     return await this.categoryService.createCategory(categoryDto);
    // }

    // @Put(":id")
    // @Permission("update_category")
    // async updateCategory(@Param("id") id: number, @Body(new ValidationPipe({ whitelist: true })) categoryDto: CategoryDto) {
    //     return await this.categoryService.updateCategory(id, categoryDto);
    // }

    // @Delete(":id")
    // @Permission("delete_category")
    // async deleteCategory(@Param("id") id: number) {
    //     return await this.categoryService.deleteCategory(id);
    // }
}