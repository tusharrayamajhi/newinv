import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";



export class changeMyPassword{
    // @ApiProperty({description:"email of user",example:"tusharraamajhi6@gmail.com"})
    // @IsEmail()
    // @IsString()
    // @IsNotEmpty()
    // email:string;

    @ApiProperty({description:"old password of user",example:"123456"})
    @IsString()
    @IsNotEmpty()
    old_password:string;

    @ApiProperty({description:"new password of user",example:"123456"})
    @IsString()
    @IsNotEmpty()
    new_password:string;
}