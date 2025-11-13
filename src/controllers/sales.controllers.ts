import { groupPermission, permissions } from './../object/permission.object';
import { Controller, Post, Req, UseGuards, ValidationPipe, Get,Param, Patch, Query, } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { salesService } from "src/services/sales.services";
import { swaggerUser } from "src/swagger/swagger.user";
import { swaggerController } from "src/swagger/swaggercontroller";
import { Body } from "@nestjs/common";
import { havePermissionGuards } from "src/guards/havePermission.guards";
import { Permission } from "src/decorator/Permission.decorator";
import { SalesDetailsDto } from 'src/dtos/createDtos/salesDetails.dtos';
import { Request } from 'express';
import { ParseUUIDPipe } from '@nestjs/common';
import { updateSales } from 'src/dtos/updateDtos/updateSales.dtos';

//swagger
@ApiTags(swaggerUser.admin + swaggerController.sales, swaggerUser.other + swaggerController.sales)
@ApiBearerAuth("jwt")
//code
@Controller('sales')
export class salesController {

    constructor(
        private readonly salesService: salesService
    ) {}


    @Post()
    @UseGuards(havePermissionGuards)
    @Permission(...groupPermission.create_sales)
    async createSales(@Body(new ValidationPipe({ whitelist: true })) salesDetails: SalesDetailsDto, @Req() req: Request) {
        return await this.salesService.createSales(salesDetails, req);
    }

    @Get()
    @UseGuards(havePermissionGuards)
    @Permission(permissions.view_All_sales)
    async getAllSales(@Req() req: Request) {
        return await this.salesService.getAllSales(req);
    }

    @Get("mySales")
    @UseGuards(havePermissionGuards)
    @Permission(permissions.view_sales)
    async getMySales(@Req() req: Request,@Query('page') page:number = 0) {
        return await this.salesService.getMySales(req,page);
    }

    @Get("user/:user_id")
    @UseGuards(havePermissionGuards)
    @Permission(permissions.view_sales)
    async getSalesByUser(@Req() req: Request,@Query('page') page:number = 0, @Param('user_id', new ParseUUIDPipe()) user_id: string) {
        return await this.salesService.getSalesByUser(req, user_id,page);
    }

    @Get("customer/:customer_id")
    @UseGuards(havePermissionGuards)
    @Permission(permissions.view_sales)
    async getSalesByCustomerId(@Req() req: Request,@Query('page') page:number = 0, @Param('customer_id', new ParseUUIDPipe()) customer_id: string) {
        return await this.salesService.getSalesByCustomerId(req, customer_id,page);
    }

    @Patch(":code")
    @UseGuards(havePermissionGuards)
    @Permission(...groupPermission.edit_sales)
    async updateSales(@Req() req: Request, @Param('code') code: string, @Body() updateSalesDto: updateSales) {
        return await this.salesService.updateSales(req, code, updateSalesDto);
    }

    @Get(":sales_code")
    @UseGuards(havePermissionGuards)
    @Permission(permissions.view_sales)
    async getSalesBySaleCode(@Req() req: Request, @Param('sales_code') sales_code: string) {
        return await this.salesService.getSalesBySaleCode(req, sales_code);
    }
}
