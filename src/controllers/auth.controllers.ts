import { SignupDto } from './../dtos/signup.dto';
import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes,ApiTags } from "@nestjs/swagger";
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from "../services/Auth.services";
import { multerOption } from '../utils/multeroptions.utils';
import { swaggerUser } from 'src/swagger/swagger.user';
import { swaggerController } from 'src/swagger/swaggercontroller';
import { AllUserCanAccess } from 'src/guards/alluserCanAccess';
import { Request } from 'express';

//swagger
@ApiTags(swaggerUser.other+swaggerController.auth,swaggerUser.superAdmin+swaggerController.auth,swaggerUser.admin+swaggerController.auth)
//code
@Controller("auth")
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    //swagger
    @ApiConsumes("multipart/form-data")
    //code
    @Post('signup')
    @UseInterceptors(FileInterceptor('user_profile', multerOption))
    async signup(@UploadedFile() user_profile: Express.Multer.File, @Body(new ValidationPipe({ whitelist: true })) userSingnupDto: SignupDto) {
        return await this.authService.signup(user_profile, userSingnupDto);
    }

    @Post("login")
    async login(@Body(new ValidationPipe({ whitelist: true })) loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }


    @Get("my_profile")
    @ApiBearerAuth("jwt")
    @UseGuards(AllUserCanAccess)
    async getMyProfile(@Req() req:Request){
        return await this.authService.getMyProfile(req)
    }
}