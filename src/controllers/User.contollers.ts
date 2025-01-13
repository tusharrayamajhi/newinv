import { UserService } from './../services/User.services';
import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { canAccess } from '../guards/canAccess.guards';
import { Roles } from 'src/decorator/Roles.decorator';
import { roles } from 'src/object/roles.object';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/utils/multeroptions.utils';
import { Request } from 'express';
import { validate } from 'class-validator';
import { Permission } from 'src/decorator/Permission.decorator';
import { permissions } from 'src/object/permission.object';
import { havePermissionGuards } from 'src/guards/havePermission.guards';
import { swaggerUser } from 'src/swagger/swagger.user';
import { swaggerController } from 'src/swagger/swaggercontroller';
import { AddUsersDto, createUserDto } from 'src/dtos/createDtos/addUser.dtos';
import { baseUpdateUserDto, UpdateUserDto } from 'src/dtos/updateDtos/updateUser.dtos';
import { AllUserCanAccess } from 'src/guards/alluserCanAccess';

//swagger
@ApiBearerAuth("jwt")
@ApiTags(swaggerUser.superAdmin+swaggerController.user,swaggerUser.admin+swaggerController.user)
//code
@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    //swagger
    @ApiConsumes("multipart/form-data")
    //code
    @Post()
    @UseGuards(canAccess)
    @Roles(roles.Admin, roles.SuperAdmin)
    @UseInterceptors(FileInterceptor('user_image', multerOption))
    async addUser(@Req() req: Request, @Body() userData: createUserDto, @UploadedFile() user_image?: Express.Multer.File | null) {
        let data = userData.data
        console.log(userData.data)
        if (typeof data == "string") {
            data = JSON.parse(data)
        }
        const user = Object.assign(new AddUsersDto(), data)
        console.log(user)
        const result = await validate(user, { whitelist: true })
        if (result.length > 0) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'Validation failed',
                errors: result.map((error) => ({
                    property: error.property,
                    constraints: error.constraints,
                })),
            });
        }
        if (user_image) {
            user['user_image'] = user_image.filename
        }
        return await this.userService.addUser(req, user)
    }

    //swagger
    //code
    @Get()
    @UseGuards(canAccess)
    @Roles(roles.Admin, roles.SuperAdmin)
    async getAllUsers(@Req() req: Request,@Query('page') page:number = 0,) {
        return await this.userService.getAllUsers(req,page)
    }

    @Get('verify_email')
    @UseGuards(AllUserCanAccess)
    async sendVerifyEmail(@Req() req:Request){
        return await this.userService.sendVerifyEmail(req)
    }

     //swagger
     //code
    @Get(":id")
    @UseGuards(havePermissionGuards)
    @Permission(permissions.view_user)
    async getUserById(@Req() req: Request, @Param("id", new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return await this.userService.getUserById(req, id)
    }

     //swagger
     //code
    @Get("company/:id")
    @UseGuards(canAccess)
    @Roles(roles.SuperAdmin,roles.Admin)
    async getUsersByCompany(@Req() req: Request,@Query('page') page:number = 0, @Param("id", new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return await this.userService.getUsersByCompany(req, id,page)
    }

     //swagger
     //code
    @Get("role/:id")
    @UseGuards(canAccess)
    @Roles(roles.SuperAdmin, roles.Admin)
    async getUsersByRole(@Req() req: Request,@Query('page') page:number = 0, @Param("id", new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return await this.userService.getUsersByRole(req, id,page)
    }

   

    @Get('verify_email/:otp')
    @UseGuards(AllUserCanAccess)
    async VerifyEmail(@Req() req:Request,@Param('otp', ParseIntPipe) otp:number){
        return await this.userService.VerifyEmail(req,otp)
    }

     //swagger
     //code
    @Patch(":id")
    @ApiConsumes("multipart/form-data")
    @UseGuards(canAccess)
    @Roles(roles.Admin, roles.SuperAdmin)
    @UseInterceptors(FileInterceptor("user_image", multerOption))
    async updateUser(@Req() req: Request, @Param("id", new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string, @Body() updateUser: UpdateUserDto, @UploadedFile() user_image?: Express.Multer.File) {
        let data = updateUser.data
        console.log(updateUser.data)
        if (typeof data == "string") {
            data = JSON.parse(data)
        }
        const user = Object.assign(new baseUpdateUserDto(), data)
        console.log(user)
        const result = await validate(user, { whitelist: true })
        if (result.length > 0) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'Validation failed',
                errors: result.map((error) => ({
                    property: error.property,
                    constraints: error.constraints,
                })),
            });
        }
        if (user_image) {
            user['user_image'] = user_image.filename
        }
        console.log(user)
        return await this.userService.updateUser(req, id, user)
    }

     //swagger
     //code
    @Delete(":id")
    @UseGuards(canAccess)
    @Roles(roles.Admin, roles.SuperAdmin)
    async deleteUser(@Req() req: Request, @Param("id", new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return await this.userService.deleteUser(req, id)
    }

   
}