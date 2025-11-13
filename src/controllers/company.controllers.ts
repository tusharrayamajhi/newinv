import { roles } from '../object/roles.object';
import { canAccess } from './../guards/canAccess.guards';
import { baseDto, CreateCompanyDto } from './../dtos/createDtos/addCompany.dtos';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './../services/company.services';
import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from '../utils/multeroptions.utils';
import { Roles } from '../decorator/Roles.decorator';
import { baseUpdateDto, UpdateCompanyDto } from 'src/dtos/updateDtos/updateCompany.dtos';
import { Request } from 'express';
import { validate } from 'class-validator';
import { swaggerUser } from 'src/swagger/swagger.user';
import { swaggerController } from 'src/swagger/swaggercontroller';

//swagger
@ApiBearerAuth("jwt")
//code
@Controller('company')
export class CompanyController {

    constructor(
        private readonly companyService: CompanyService
    ) { }

    // //swagger
    // @ApiConsumes("multipart/form-data")
    // @ApiTags(swaggerUser.superAdmin+swaggerController.company)
    // //code
    // @Post()
    // @UseGuards(canAccess)
    // @Roles(roles.SuperAdmin)
    // @UseInterceptors(FileInterceptor('company_logo', multerOption))
    // async addCompany(@Body() createCompany: CreateCompanyDto, @Req() req: Request, @UploadedFile() company_logo?: Express.Multer.File) {
    //     let data = createCompany.data
    //     if (typeof data == "string") {
    //         data = JSON.parse(data)
    //     }
    //     const company = Object.assign(new baseDto(), data)
    //     const result = await validate(company, { whitelist: true })
    //     if (result.length > 0) {
    //         // If validation fails, throw a BadRequestException with the errors
    //         throw new BadRequestException({
    //             statusCode: 400,
    //             message: 'Validation failed',
    //             errors: result.map((error) => ({
    //                 property: error.property,
    //                 constraints: error.constraints,
    //             })),
    //         });
    //     }
    //     company.company_logo = company_logo?.filename || "";
    //     return await this.companyService.addCompany(company, req);
    // }

    //swagger
    @ApiTags(swaggerUser.superAdmin+swaggerController.company)
    //code
    @Get()
    @UseGuards(canAccess)
    @Roles(roles.SuperAdmin)
    async getAllCompany(@Query('page') page:number = 0) {
        return await this.companyService.getAllCompany(page);
    }

    //swagger
    //code
    @ApiTags(swaggerUser.superAdmin+swaggerController.company,swaggerUser.admin+swaggerController.company)
    @Get(":id")
    @UseGuards(canAccess)
    @Roles(roles.Admin, roles.SuperAdmin)
    async getCompanyById(@Param("id", new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string, @Req() req: Request) {
        return await this.companyService.getCompanyById(id, req);
    }

    //swagger
    // @ApiConsumes("multipart/form-data")
    // @ApiTags(swaggerUser.superAdmin+swaggerController.company)
    // //code
    // @Roles(roles.SuperAdmin)
    // @Patch(':company_id')
    // @UseGuards(canAccess)
    // @UseInterceptors(FileInterceptor('company_logo', multerOption))
    // async updateCompany(@Param("company_id", new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) company_id: string, @Body() updateCompanyDto: UpdateCompanyDto, @UploadedFile() companylogo?: Express.Multer.File) {
    //     let data = updateCompanyDto.data
    //     if (typeof data == "string") {
    //         data = JSON.parse(data)
    //     }
    //     const company = Object.assign(new baseUpdateDto(), data)
    //     const result = await validate(company, { whitelist: true })
    //     if (result.length > 0) {
    //         // If validation fails, throw a BadRequestException with the errors
    //         throw new BadRequestException({
    //             statusCode: 400,
    //             message: 'Validation failed',
    //             errors: result.map((error) => ({
    //                 property: error.property,
    //                 constraints: error.constraints,
    //             })),
    //         });
    //     }
    //     company.company_logo = companylogo?.filename || ""
    //     // return company
    //     return await this.companyService.updateCompany(company_id, company)
    // }

    //swagger
    @ApiTags(swaggerUser.superAdmin+swaggerController.company)
    //code
    @Delete(":company_id")
    @Roles(roles.SuperAdmin)
    @UseGuards(canAccess)
    async deleteCompany(@Param('company_id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) company_id: string) {
        return await this.companyService.deleteCompany(company_id);

    }


}