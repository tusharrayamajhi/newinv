import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class changeForgetPasswordDto{
    @ApiProperty({description:"enter otp",example:"1234"})
    @IsNotEmpty()
    @IsString()
    otp:string

    @ApiProperty({description:"enter email",example:"tusharrayamajhi6@gmail.com"})
    @IsNotEmpty()
    @IsEmail()
    email:string

    @ApiProperty({description:"enter new password",example:"tusharrayamajhi"})
    @IsNotEmpty()
    @IsString()
    new_password:string
}