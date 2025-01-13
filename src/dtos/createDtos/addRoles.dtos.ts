import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsLowercase, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Name of the role',
    example: 'Admin',
  })
  @IsNotEmpty()
  @IsString()
  @IsLowercase()
  @Length(1, 200)
  name: string;

  @ApiProperty({
    description: 'Description of the role',
    example: 'Administrator role with full access',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({required:false,description:"only for superAdmin if super admin want to create a role for any company",example:"company uuid"})
  @IsNotEmpty()
  @IsString()
  companyId?:string

  @ApiProperty({
    description: 'Array of permission IDs associated with this role',
    example: ["permission id 1", "permission id 2", "permission id 3"],
    required: false,
  })
  @IsOptional()
  @IsArray()
  permission?: string[]; 
}
