import { purchaseService } from 'src/services/purchase.services';
import { Body, Controller, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { swaggerController } from 'src/swagger/swaggercontroller';
import { swaggerUser } from 'src/swagger/swagger.user';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { havePermissionGuards } from 'src/guards/havePermission.guards';
import { groupPermission, permissions } from 'src/object/permission.object';
import { Permission } from 'src/decorator/Permission.decorator';
import { Request } from 'express';
import { PurchaseDetail } from 'src/dtos/createDtos/createPurchaseDetails.dtos';
import { updatePurchase } from 'src/dtos/updateDtos/updatePurchase.dtos';


//swagger
@ApiTags(swaggerUser.other+swaggerController.purchase,swaggerUser.admin+swaggerController.purchase)
@ApiBearerAuth("jwt")
//code
@Controller('purchase')
export class PurchaseController{


    constructor(
        private readonly purchaseService:purchaseService
    ){}


    @Post()
    @UseGuards(havePermissionGuards)
    @Permission(...groupPermission.create_purchase)
    async createPurchase(@Req() req:Request, @Body(new ValidationPipe({whitelist: true,})) createPurchaseDto:PurchaseDetail){
        return  await this.purchaseService.createPurchase(req,createPurchaseDto)
    }

    @Get()
    @UseGuards(havePermissionGuards)
    @Permission(permissions.view_All_purchase)
    async getAllPurchase(@Req() req:Request){
        return await this.purchaseService.getAllPurchase(req)
    }

    @Get("myPurchases")
    @UseGuards(havePermissionGuards)
    @Permission(permissions.view_purchase)
    async getMyPurchase(@Req() req:Request,@Query('page') page:number = 0,){
        return await this.purchaseService.getMyPurchases(req,page)
    }

    @Get("user/:user_id")
    @UseGuards(havePermissionGuards)
    @Permission(permissions.view_purchase)
    async getPurchaseByUserId(@Req() req:Request,@Query('page') page:number = 0,@Param('user_id', new ParseUUIDPipe({errorHttpStatusCode:HttpStatus.INTERNAL_SERVER_ERROR})) user_id:string){
        return await this.purchaseService.getPurchaseByUser(req,user_id,page)
    }

    
    @Get("vendor/:vendor_id")
    @UseGuards(havePermissionGuards)
    @Permission(permissions.view_purchase)
    async getPurchaseByVendorId(@Req() req:Request,@Query('page') page:number = 0,@Param("vendor_id", new ParseUUIDPipe({errorHttpStatusCode:HttpStatus.INTERNAL_SERVER_ERROR})) vendor_id:string){
        return await this.purchaseService.getPurchaseByVendorId(req,vendor_id,page)
    }

    

    @Patch(":code")
    @UseGuards(havePermissionGuards)
    @Permission(permissions.view_purchase)
    async updatePurchase(@Req() req:Request,@Param('code') code:string,@Body(new ValidationPipe({whitelist:true})) updatePurchase:updatePurchase){
        return await this.purchaseService.updatePurchases(req,code,updatePurchase)
    }

    @Get(":code")
    @UseGuards(havePermissionGuards)
    @Permission(permissions.view_purchase)
    async getPurchaseById(@Req() req:Request,@Param("code") code:string){
        return await this.purchaseService.getPurchaseById(req,code)
    }

}