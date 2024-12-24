import { AllUserCanAccess } from './../guards/alluserCanAccess';
import { UpdateRoleDto } from './../dtos/updateRole.dtos';
import { canAccess } from './../guards/canAccess.guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesService } from './../services/role.services';
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { CreateRoleDto } from 'src/dtos/addRoles.dtos';
import { Roles } from 'src/decorator/Roles.decorator';
import { roles } from 'src/object/roles.object';
import { Request } from 'express';
import { swaggerUser } from 'src/swagger/swagger.user';
import { swaggerController } from 'src/swagger/swaggercontroller';

//swagger
@ApiBearerAuth("jwt")
@ApiTags(swaggerUser.admin + swaggerController.roles)
//code
@Controller('roles')
export class RolesController {


    constructor(
        private rollService: RolesService
    ) { }

    //swagger
    //code
    @Post()
    @UseGuards(canAccess)
    @Roles(roles.Admin)
    async addRoles(@Req() req: Request, @Body(new ValidationPipe({ whitelist: true, })) createRoleDto: CreateRoleDto) {
        return await this.rollService.addRoles(req, createRoleDto)
    }

    //swagger
    //code
    @Get()
    @UseGuards(canAccess)
    @Roles(roles.Admin)
    async getRoles(@Req() req: Request) {
        return await this.rollService.getRoles(req)
    }
    //swagger
    @ApiTags(swaggerUser.superAdmin + swaggerController.roles,swaggerUser.other+swaggerController.roles)
    //code
    @Get("mypermission")
    @UseGuards(AllUserCanAccess)
    async getMyPermissions(@Req() req: Request) {
        return await this.rollService.getMyPermissions(req)
    }


    @Get("permission/:role_id")
    @UseGuards(canAccess)
    @Roles(roles.Admin)
    async getPermissionsByRoleId(@Req() req: Request, @Param('role_id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) role_id: string) {
        return await this.rollService.getPermissionsByRoleId(req, role_id)
    }

    //swagger
    //code
    @Get(":id")
    @UseGuards(canAccess)
    @Roles(roles.Admin)
    async getRolesById(@Req() req: Request, @Param("id", new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return await this.rollService.getRolesById(req, id)
    }

    
    //swagger
    //code
    @Patch(':id')
    @UseGuards(canAccess)
    @Roles(roles.Admin)
    async updateRoles(@Req() req: Request, @Param("id", new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string, @Body(new ValidationPipe({ whitelist: true })) updateRoleDto: UpdateRoleDto) {
        return await this.rollService.updateRoles(req, id, updateRoleDto)
    }

    




    //swagger
    //code
    @Delete(':id')
    @UseGuards(canAccess)
    @Roles(roles.Admin)
    async deleteRoles(@Req() req: Request, @Param("id", new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return await this.rollService.deleteRoles(req, id)
    }
}