import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Permission } from "src/decorator/Permission.decorator";
import { addBrandDto } from "src/dtos/createDtos/addBrands.dtos";
import { UpdateBrandDto } from "src/dtos/updateDtos/updateBrands.dtos";
import { havePermissionGuards } from "src/guards/havePermission.guards";
import { permissions } from "src/object/permission.object";
import { BrandService } from "src/services/brand.services";
import { swaggerUser } from "src/swagger/swagger.user";
import { swaggerController } from "src/swagger/swaggercontroller";

//swagger
@ApiTags(swaggerUser.admin + swaggerController.brand, swaggerUser.other + swaggerController.brand, swaggerUser.superAdmin + swaggerController.brand)
@ApiBearerAuth("jwt")
//code
@Controller('brand')
export class BrandsController {

    constructor(
        private readonly brandService: BrandService
    ) { }

    @Post()
    @Permission(permissions.create_brand)
    @UseGuards(havePermissionGuards)
    async addBrand(@Req() req: Request, @Body(new ValidationPipe({ whitelist: true, })) createBrand: addBrandDto) {
        return await this.brandService.addBrand(req, createBrand)
    }

    @Get()
    @Permission(permissions.view_brand)
    @UseGuards(havePermissionGuards)
    async ViewAllBrand(@Req() req: Request,@Query('page') page:number = 0) {
        return await this.brandService.getAllBrands(req,page)
    }

    @Get("company/:companyId")
    @Permission(permissions.view_brand)
    @UseGuards(havePermissionGuards)
    async getBrandsByCompanyId(@Req() req: Request,@Query('page') page:number = 0, @Param('companyId', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) companyId: string) {
        return await this.brandService.getBrandsByCompanyId(req, companyId,page);
    }
    
    @Get(":id")
    @Permission(permissions.view_brand)
    @UseGuards(havePermissionGuards)
    async getBrandsById(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string) {
        return await this.brandService.getBrandById(req, id)
    }

   

    @Patch(':id')
    @Permission(permissions.update_brand)
    @UseGuards(havePermissionGuards)
    async updateBrand(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string, @Body(new ValidationPipe({ whitelist: true })) updateBrandDto: UpdateBrandDto) {
        return await this.brandService.updateBrand(req, id, updateBrandDto);
    }

    @Delete(':id')
    @Permission(permissions.delete_brand)
    @UseGuards(havePermissionGuards)
    async deleteBrand(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string) {
        return await this.brandService.deleteBrand(req, id);
    }
}