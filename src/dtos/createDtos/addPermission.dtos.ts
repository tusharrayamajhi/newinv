import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Name of the permission',
    example: 'Create Users',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Description of the permission',
    example: 'Allows creating new users',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
