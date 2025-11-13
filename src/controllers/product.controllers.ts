import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards, HttpStatus, Query } from "@nestjs/common";
import { ParseUUIDPipe, ValidationPipe } from "@nestjs/common/pipes";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { swaggerUser } from "src/swagger/swagger.user";
import { havePermissionGuards } from "src/guards/havePermission.guards";
import { Permission } from 'src/decorator/Permission.decorator';
import { permissions } from "src/object/permission.object";
import { swaggerController } from "src/swagger/swaggercontroller";
import { ProductService } from "src/services/product.services";
import { AddProductDto } from "src/dtos/createDtos/addProduct.dtos";
import { UpdateProdcutDtos } from "src/dtos/updateDtos/updateProduct.dtos";

//swagger
@ApiTags(swaggerUser.admin + swaggerController.product, swaggerUser.other + swaggerController.product, swaggerUser.superAdmin + swaggerController.product)
@ApiBearerAuth("jwt")
//code
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    @Permission(permissions.create_product)
    @UseGuards(havePermissionGuards)
    async addProduct(@Req() req: Request, @Body(new ValidationPipe({ whitelist: true })) createProduct: AddProductDto ) {
        return await this.productService.addProduct(req, createProduct);
    }

    @Get("company/:companyId")
    @Permission(permissions.view_product)
    @UseGuards(havePermissionGuards)
    async getProductsByCompanyId(@Req() req: Request, @Param('companyId', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) companyId: string) {
        return await this.productService.getProductsByCompanyId(req,companyId);
    }

    @Get("brand/:brandId")
    @Permission(permissions.view_product)
    @UseGuards(havePermissionGuards)
    async getProductsByBrandId(@Req() req: Request,@Query('page') page:number = 0, @Param('brandId', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) brandId: string) {
        return await this.productService.getProductsByBrandId(req, brandId,page);
    }

    @Get("category/:categoryId")
    @Permission(permissions.view_product)
    @UseGuards(havePermissionGuards)
    async getProductsByCategoryId(@Req() req: Request,@Query('page') page:number = 0, @Param('categoryId', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) categoryId: string) {
        return await this.productService.getProductsByCategoryId(req, categoryId,page);
    }

    @Get()
    @Permission(permissions.view_product)
    @UseGuards(havePermissionGuards)
    async viewAllProducts(@Req() req: Request,@Query('page') page:number = 0) {
        return await this.productService.getAllProducts(req,page);
    }

    @Get("forSale")
    @Permission(permissions.view_selling_product)
    @UseGuards(havePermissionGuards)
    async getAllProductAvailableForSale(@Req() req: Request,@Query('page') page:number = 0) {
        return await this.productService.getAllProductAvailableForSale(req,page);
    }
    
    @Get('lowStockNotification')
    @Permission(permissions.get_low_stock_notification)
    @UseGuards(havePermissionGuards)
    async lowStockNotification(@Req() req: Request,@Query('page') page:number = 0) {
        return await this.productService.lowStockNotification(req,page);
    }
    
    @Get(":id")
    @Permission(permissions.view_product)
    @UseGuards(havePermissionGuards)
    async getProductById(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string) {
        return await this.productService.getProductById(req, id);
    }

    @Patch(':id')
    @Permission(permissions.update_product)
    @UseGuards(havePermissionGuards)
    async updateProduct(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string, @Body(new ValidationPipe({ whitelist: true })) updateProductDto: UpdateProdcutDtos) {
        return await this.productService.updateProduct(req, id, updateProductDto);
    }


    @Delete(':id')
    @Permission(permissions.delete_product)
    @UseGuards(havePermissionGuards)
    async deleteProduct(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string) {
        return await this.productService.deleteProduct(req, id);
    }
}
