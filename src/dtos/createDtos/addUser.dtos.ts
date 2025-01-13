import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, Length } from "class-validator";



export class AddUsersDto {

    @ApiProperty({description:"enter user name",example:"suresh",required:true})
    @IsNotEmpty()
    @IsString()
    @Length(1,100)
    first_name: string;

    @ApiProperty({description:"enter user middle name if exists",example:"kumar",required:false})
    @IsOptional()
    @IsString()
    middle_name?: string;

    @ApiProperty({description:"enter user last name",example:"Barghare",required:true})
    @IsNotEmpty()
    @IsString()
    @Length(1,100)
    last_name: string;

    @ApiProperty({description:"enter user address",example:"palpa 2 purbhakhola",required:false})
    @IsOptional()
    @IsString()
    @Length(1,100)
    address?: string;

    @ApiProperty({description:"enter user phone no",example:"9812345678",required:true})
    @IsNotEmpty()
    @IsString()
    @Length(10)
    phone: string; 

    @ApiProperty({description:"enter user email address",example:"suresh@gmail.com",required:true})
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({description:"enter pasword",example:"sureshKoPassword",required:true})
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({default:0,type:"integer",required:false,description:"select active or not",example:"0 for not active and 1 for active"})
    @IsOptional()
    is_active?: number;

    // @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Profile picture of the user'}) 
    // @Transform(({value})=>value?.buffer)
    // @IsOptional()
    // user_image?: string;

    @ApiProperty({description:"enter user company id",required:false})
    @IsOptional()
    company?:string

    @ApiProperty({description:"enter user role id",required:false})
    @IsOptional()
    roles?:string

}

export class createUserDto{
    
      @ApiProperty({
        description: 'user image (optional for updates)',
        type: 'string',
        format: 'binary',
        required: false,
      })
      @IsOptional()
      @IsString()
      user_image?: string;
    
      @ApiProperty({
        description: 'Updated user data (optional for updates)',
        type: () => AddUsersDto,
      })
      @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
      @IsOptional()
      @IsObject()
      @Type(() => AddUsersDto)
      data?: AddUsersDto;
}