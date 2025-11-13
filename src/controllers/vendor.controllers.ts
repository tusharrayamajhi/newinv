import { Body, Controller, Post, Req, UseGuards, ValidationPipe, Get, Param, ParseUUIDPipe, HttpStatus, Patch, Delete, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Permission } from "src/decorator/Permission.decorator";
import { CreateVendor } from "src/dtos/createDtos/createVendor.dtos";
import { updateVendor } from "src/dtos/updateDtos/updateVendor.dtos";
import { havePermissionGuards } from "src/guards/havePermission.guards";
import { permissions } from "src/object/permission.object";
import { VendorService } from "src/services/vendor.services";
import { swaggerUser } from "src/swagger/swagger.user";
import { swaggerController } from "src/swagger/swaggercontroller";

//swagger
@ApiBearerAuth("jwt")
@ApiTags(swaggerUser.superAdmin+swaggerController.vendor,swaggerUser.admin+swaggerController.vendor)
//code
@Controller('vendors')
export class VendorController {
    constructor(
        private readonly vendorService: VendorService
    ) { }

    @Post()
    @Permission(permissions.create_vendor)
    @UseGuards(havePermissionGuards)
    async addVendor(@Req() req: Request, @Body(new ValidationPipe({ whitelist: true })) createVendorDto: CreateVendor) {
        return await this.vendorService.addVendor(req, createVendorDto);
    }

    @Get()
    @Permission(permissions.view_vendor)
    @UseGuards(havePermissionGuards)
    async viewAllVendors(@Req() req: Request) {
        return await this.vendorService.getAllVendors(req);
    }

    @Get(":id")
    @Permission(permissions.view_vendor)
    @UseGuards(havePermissionGuards)
    async getVendorById(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string) {
        return await this.vendorService.getVendorById(req, id);
    }

    @Patch(':id')
    @Permission(permissions.update_vendor)
    @UseGuards(havePermissionGuards)
    async updateVendor(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string, @Body(new ValidationPipe({ whitelist: true })) updateVendorDto: updateVendor) {
        return await this.vendorService.updateVendor(req, id, updateVendorDto);
    }

    @Delete(':id')
    @Permission(permissions.delete_vendor)
    @UseGuards(havePermissionGuards)
    async deleteVendor(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string) {
        return await this.vendorService.deleteVendor(req, id);
    }
}
