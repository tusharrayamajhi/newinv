import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Name of the role',
    example: 'Admin',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  name: string;

  @ApiProperty({
    description: 'Description of the role',
    example: 'Administrator role with full access',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Array of permission IDs associated with this role',
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  @IsArray()
  permission?: string[]; 
}
