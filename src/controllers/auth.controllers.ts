import { SignupDto } from './../dtos/createDtos/signup.dto';
import { Body, Controller, Get, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { LoginDto } from '../dtos/createDtos/login.dto';
import { AuthService } from "../services/Auth.services";
import { multerOption } from '../utils/multeroptions.utils';
import { swaggerUser } from 'src/swagger/swagger.user';
import { swaggerController } from 'src/swagger/swaggercontroller';
import { AllUserCanAccess } from 'src/guards/alluserCanAccess';
import { Request } from 'express';
import { changeMyPassword } from 'src/dtos/updateDtos/changePasswordDtos';
import { ChangeUserPasswordDto } from 'src/dtos/updateDtos/changeUserPassword.dtos';
import { canAccess } from 'src/guards/canAccess.guards';
import { Roles } from 'src/decorator/Roles.decorator';
import { roles } from 'src/object/roles.object';
import { forgetPasswordDto } from 'src/dtos/createDtos/forgetPassword.dtos';
import { changeForgetPasswordDto } from 'src/dtos/createDtos/changeforgetPassword.Dto';
import { CreateCompanyDto } from 'src/dtos/createDtos/addCompany.dtos';

//swagger
@ApiTags(swaggerUser.other + swaggerController.auth, swaggerUser.superAdmin + swaggerController.auth, swaggerUser.admin + swaggerController.auth)
//code
@Controller("auth")
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    //swagger
    // @ApiConsumes("multipart/form-data")
    // //code
    // @Post('signup')
    // @UseInterceptors(FileInterceptor('user_profile', multerOption))
    // async signup(@UploadedFile() user_profile: Express.Multer.File, @Body(new ValidationPipe({ whitelist: true })) userSignUpDto: SignupDto) {
    //     return await this.authService.signup(user_profile, userSignUpDto);
    // }

    @Post('signup')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'user[user_profile]', maxCount: 1 },
            { name: 'company[company_logo]', maxCount: 1 },
        ]),
    )
    async signup(
        @Body('user') userBody: any, // No need for string
        @Body('company') companyBody: any,
        @UploadedFiles()
        files: {
            'user[user_profile]'?: Express.Multer.File[];
            'company[company_logo]'?: Express.Multer.File[];
        },
    ) {
        console.log(userBody);
        console.log(companyBody);

        const userDto: SignupDto = userBody;
        const companyDto: CreateCompanyDto = { data: companyBody };

        if (files['user[user_profile]']) {
            userDto.user_profile = files['user[user_profile]'][0];
        }

        if (files['company[company_logo]']) {
            companyDto.company_logo = files['company[company_logo]'][0];
        }
        console.log("first")
        return this.authService.signup(userDto, companyDto);
    }


    @Post("login")
    async login(@Body(new ValidationPipe({ whitelist: true })) loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }

    @Get("my_profile")
    @ApiBearerAuth("jwt")
    @UseGuards(AllUserCanAccess)
    async getMyProfile(@Req() req: Request) {
        return await this.authService.getMyProfile(req)
    }

    @Post('changeMyPassword')
    @ApiBearerAuth("jwt")
    @UseGuards(AllUserCanAccess)
    async changePassword(@Body(new ValidationPipe({ whitelist: true })) changePassword: changeMyPassword, @Req() req: Request) {
        return await this.authService.changePassword(changePassword, req);
    }

    @Post("changeUserPassword")
    @ApiBearerAuth("jwt")
    @UseGuards(canAccess)
    @Roles(roles.Admin, roles.SuperAdmin)
    async changeUserPassword(@Body(new ValidationPipe({ whitelist: true })) changeUserPassword: ChangeUserPasswordDto, @Req() req: Request) {
        return await this.authService.changeUserPassword(changeUserPassword, req);
    }

    @Post("logout")
    @ApiBearerAuth("jwt")
    @UseGuards(AllUserCanAccess)
    async logout(@Req() req: Request) {
        return await this.authService.logout(req);
    }

    @Post("forgotPassword")
    async forgotPassword(@Body(new ValidationPipe({ whitelist: true })) forgetPasswordDto: forgetPasswordDto) {
        return await this.authService.forgotPassword(forgetPasswordDto);
    }

    @Post("changePassword")
    async changeForgetPassword(@Body(new ValidationPipe({ whitelist: true })) passwordDto: changeForgetPasswordDto) {
        return await this.authService.changeForgetPassword(passwordDto);
    }

}