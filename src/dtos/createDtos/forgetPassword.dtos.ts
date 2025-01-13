import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";



export class forgetPasswordDto{
    @ApiProperty({description:"Email of the user",example:"tusharrayamajhi6@gmail.com"})
    @IsNotEmpty()
    @IsEmail()
    email:string
}