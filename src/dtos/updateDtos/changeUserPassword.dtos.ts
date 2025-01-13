import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";




export class ChangeUserPasswordDto {
    @ApiProperty({description:"old password of user",example:"123456"})
    @IsString()
    @IsNotEmpty()
    password:string;
    
    @ApiProperty({description:"new password of user",example:"123456"})
    @IsString()
    @IsNotEmpty()
    user_id:string;
    }