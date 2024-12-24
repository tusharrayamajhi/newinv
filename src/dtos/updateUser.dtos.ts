
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { AddUsersDto } from './addUser.dtos';
// import { AddUsersDto } from './addUser.dtos';

export class baseUpdateUserDto extends PartialType(AddUsersDto) {}
export class UpdateUserDto{

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
    type: () => baseUpdateUserDto,
  })
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @IsOptional()
  @IsObject()
  @Type(() => baseUpdateUserDto)
  data?: baseUpdateUserDto;
}



//     @ApiProperty({ description: "Update user first name", example: "Suresh", required: false })
//     @IsOptional()
//     @IsString()
//     @Length(1, 100)
//     first_name?: string;

//     @ApiProperty({ description: "Update user middle name", example: "Kumar", required: false })
//     @IsOptional()
//     @IsString()
//     middle_name?: string;

//     @ApiProperty({ description: "Update user last name", example: "Barghare", required: false })
//     @IsOptional()
//     @IsString()
//     @Length(1, 100)
//     last_name?: string;

//     @ApiProperty({ description: "Update user address", example: "Palpa 2 Purbhakhola", required: false })
//     @IsOptional()
//     @IsString()
//     @Length(1, 100)
//     address?: string;

//     @ApiProperty({ description: "Update user phone number", example: "9812345678", required: false })
//     @IsOptional()
//     @IsString()
//     @Length(10, 15)
//     phone?: string;

//     @ApiProperty({ description: "Update user email address", example: "suresh@gmail.com", required: false })
//     @IsOptional()
//     @IsEmail()
//     email?: string;

//     @ApiProperty({ default: 0, type: "integer", required: false, description: "Update active status", example: "0 for not active and 1 for active" })
//     @IsOptional()
//     @IsNumber()
//     is_active?: number;

//     @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Update profile picture of the user' }) 
//     @Transform(({ value }) => value?.buffer)
//     @IsOptional()
//     user_image?: string;

//     @ApiProperty({ description: "Update user company id", required: false })
//     @IsOptional()
//     @IsString()
//     company?: string;

//     @ApiProperty({ description: "Update user role id", required: false })
//     @IsOptional()
//     @IsString()
//     roles?: string;

//     // @ApiProperty({ description: "Update user permission ids", type: [String], example: ["uuid1", "uuid2"], required: false })
//     // @IsOptional()
//     // @IsArray()
//     // @IsString({ each: true })
//     // permission?: string[];
// }
