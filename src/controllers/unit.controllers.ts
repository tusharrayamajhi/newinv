import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Permission } from "src/decorator/Permission.decorator";
import { createUnitsDto } from "src/dtos/createDtos/addunit.dtos";
import { UpdateUnitDto } from "src/dtos/updateDtos/updateunit.dtos";
import { havePermissionGuards } from "src/guards/havePermission.guards";
import { permissions } from "src/object/permission.object";
import { UnitService } from "src/services/unit.services";
import { swaggerUser } from "src/swagger/swagger.user";
import { swaggerController } from "src/swagger/swaggercontroller";

//swagger
@ApiTags(swaggerUser.admin + swaggerController.units, swaggerUser.other + swaggerController.units, swaggerUser.superAdmin + swaggerController.units)
@ApiBearerAuth("jwt")
//code
@Controller('unit')
export class UnitsController {

    constructor(
        private readonly unitService: UnitService
    ) { }

    @Post()
    @Permission(permissions.create_unit)
    @UseGuards(havePermissionGuards)
    async addUnit(@Req() req: Request, @Body(new ValidationPipe({ whitelist: true, })) createUnit: createUnitsDto) {
        return await this.unitService.addUnit(req, createUnit)
    }

    @Get()
    @Permission(permissions.view_unit)
    @UseGuards(havePermissionGuards)
    async ViewAllUnits(@Req() req: Request) {
        return await this.unitService.getAllUnits(req)
    }

    @Get(":id")
    @Permission(permissions.view_unit)
    @UseGuards(havePermissionGuards)
    async getUnitById(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string) {
        return await this.unitService.getUnitById(req, id)
    }

    @Get("company/:companyId")
    @Permission(permissions.view_unit)
    @UseGuards(havePermissionGuards)
    async getUnitsByCompanyId(@Req() req: Request,@Query('page') page:number = 0, @Param('companyId', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) companyId: string) {
        return await this.unitService.getUnitsByCompanyId(req, companyId,page);
    }

    @Patch(':id')
    @Permission(permissions.update_unit)
    @UseGuards(havePermissionGuards)
    async updateUnit(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string, @Body(new ValidationPipe({ whitelist: true })) updateUnitDto: UpdateUnitDto) {
        return await this.unitService.updateUnit(req, id, updateUnitDto);
    }

    @Delete(':id')
    @Permission(permissions.delete_unit)
    @UseGuards(havePermissionGuards)
    async deleteUnit(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string) {
        return await this.unitService.deleteUnit(req, id);
    }
}