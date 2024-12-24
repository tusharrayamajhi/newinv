import { IsString, IsOptional, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SignupDto {
  @ApiProperty({
    description: 'First name of the user',
    maxLength: 100,
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  first_name: string;

  @ApiPropertyOptional({
    description: 'Middle name of the user (optional)',
    maxLength: 100,
    example: 'Michael',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  middle_name?: string;

  @ApiProperty({
    description: 'Last name of the user',
    maxLength: 100,
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  last_name: string;

  @ApiPropertyOptional({
    description: 'Address of the user (optional)',
    maxLength: 100,
    example: '123 Main Street, Springfield',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  address?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the user (optional)',
    maxLength: 15,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  phone?: string;

  @ApiProperty({
    description: 'Email address of the user',
    maxLength: 100,
    example: 'john.doe3@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    maxLength: 255,
    example: 'StrongPassword123!',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;



  @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Profile picture of the user'}) 
  @Transform(({ value }) => value?.buffer) 
  @IsOptional()
  user_profile: Express.Multer.File;

}
