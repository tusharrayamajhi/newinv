import { canAccess } from './../guards/canAccess.guards';
import {  ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionService } from './../services/Permission.services';
import { Body, Controller, Get, HttpStatus, Param, ParseUUIDPipe, Post, Req, UseGuards, ValidationPipe} from "@nestjs/common";
import { Roles } from 'src/decorator/Roles.decorator';
import { roles } from 'src/object/roles.object';
import { CreatePermissionDto } from 'src/dtos/createDtos/addPermission.dtos';
import { Request } from 'express';
import { swaggerUser } from 'src/swagger/swagger.user';
import { swaggerController } from 'src/swagger/swaggercontroller';

//swagger
@ApiBearerAuth("jwt")
@ApiTags(swaggerUser.superAdmin+swaggerController.permission)
//code
@Controller('permission')
export class PermissionController{
    constructor(
        private readonly permissionService:PermissionService
    ){}

    @Post()
    @UseGuards(canAccess)
    @Roles(roles.SuperAdmin)
    async postPermission(@Req() req:Request,@Body(new ValidationPipe({whitelist:true})) data:CreatePermissionDto){
        return await this.permissionService.postPermission(req,data)
    }

    //swagger
    @ApiTags(swaggerUser.superAdmin+swaggerController.permission,swaggerUser.admin+swaggerController.permission)
    //code
    @Get()
    @UseGuards(canAccess)
    @Roles(roles.SuperAdmin,roles.Admin)
    async getAllPermission(){
        return await this.permissionService.getAllPermission()
    }

    //swagger
    //code
    @Get(":role_id")
    @UseGuards(canAccess)
    @Roles(roles.SuperAdmin)
    async getPermissionByRole(@Param('role_id',new ParseUUIDPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE})) role_id:string,@Req() req:Request){
        return await this.permissionService.getPermissionByRole(role_id,req)
    }

}
