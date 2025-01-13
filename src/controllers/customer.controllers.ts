import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards, HttpStatus, Query } from "@nestjs/common";
import { ParseUUIDPipe, ValidationPipe } from "@nestjs/common/pipes";
import { CustomerService } from "src/services/customer.services";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { swaggerUser } from "src/swagger/swagger.user";
import { swaggerController } from "src/swagger/swaggercontroller";
import { havePermissionGuards } from "src/guards/havePermission.guards";
import { Permission } from 'src/decorator/Permission.decorator';
import { permissions } from "src/object/permission.object";
import { updateCustomerDto } from "src/dtos/updateDtos/updateCustomer.dtos";
import { CreateCustomerDto } from "src/dtos/createDtos/createCustomer.dtos";

//swagger
@ApiTags(swaggerUser.admin + swaggerController.customer, swaggerUser.other + swaggerController.customer, swaggerUser.superAdmin + swaggerController.customer)
@ApiBearerAuth("jwt")
//code
@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post()
    @Permission(permissions.create_customer)
    @UseGuards(havePermissionGuards)
    async addCustomer(@Req() req: Request, @Body(new ValidationPipe({ whitelist: true })) createCustomer: CreateCustomerDto) {
        return await this.customerService.addCustomer(req, createCustomer);
    }

    @Get()
    @Permission(permissions.view_customer)
    @UseGuards(havePermissionGuards)
    async viewAllCustomers(@Req() req: Request,@Query('page') page:number = 0) {
        return await this.customerService.getAllCustomers(req,page);
    }

   

    @Get("company/:companyId")
    @Permission(permissions.view_customer)
    @UseGuards(havePermissionGuards)
    async getCustomersByCompanyId(@Req() req: Request,@Query('page') page:number = 0, @Param('companyId', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) companyId: string) {
        return await this.customerService.getCustomersByCompanyId(req, companyId,page);
    }

    @Get(":id")
    @Permission(permissions.view_customer)
    @UseGuards(havePermissionGuards)
    async getCustomerById(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string) {
        return await this.customerService.getCustomerById(req, id);
    }

    @Patch(':id')
    @Permission(permissions.update_customer)
    @UseGuards(havePermissionGuards)
    async updateCustomer(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string, @Body(new ValidationPipe({ whitelist: true })) updateCustomerDto: updateCustomerDto) {
        return await this.customerService.updateCustomer(req, id, updateCustomerDto);
    }

    @Delete(':id')
    @Permission(permissions.delete_customer)
    @UseGuards(havePermissionGuards)
    async deleteCustomer(@Req() req: Request, @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR })) id: string) {
        return await this.customerService.deleteCustomer(req, id);
    }
}
