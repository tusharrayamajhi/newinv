import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsEmail, Length, ValidateNested, IsObject } from 'class-validator';

export class baseDto {
    @ApiProperty({ description: 'Name of the company', example: 'TechCorp' })
    @IsString()
    @Length(1, 100)
    company_name: string;

    @ApiProperty({ description: 'Unique code for the company', example: 'TECH001' })
    @IsString()
    @Length(1, 50)
    company_code: string;

    @ApiProperty({ description: 'Company registration number', example: '12345678' })
    @IsString()
    @Length(1, 100)
    registration_no: string;

    @ApiProperty({ description: 'Company phone number', example: '1234567890' })
    @IsString()
    @Length(1, 10)
    phone: string;

    @ApiProperty({ description: 'Company email address', example: 'info@techcorp.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Company PAN or VAT number', example: 'PAN12345678' })
    @IsString()
    @Length(1, 100)
    pan_vat_no: string;

    @ApiProperty({ description: 'Company address', example: '123 Street, City' })
    @IsString()
    @Length(1, 100)
    address: string;

    @ApiProperty({ description: 'Country where the company is located', example: 'Nepal' })
    @IsString()
    @Length(1, 50)
    country: string;

    @ApiProperty({ description: 'State where the company is located', example: 'Province 3', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    state?: string;

    @ApiProperty({ description: 'City where the company is located', example: 'Kathmandu', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    city?: string;

    @ApiProperty({ description: 'ZIP code of the company address', example: 44600, required: false })
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value))
    zip?: number;

    @ApiProperty({ description: 'Name of the company bank', example: 'Nepal Bank', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    bank_name?: string;

    @ApiProperty({ description: 'Bank account number', example: '987654321', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    account_no?: string;

    @ApiProperty({ description: 'Branch of the bank', example: 'Durbar Marg', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    bank_branch?: string;

    @ApiProperty({ description: 'Address of the bank', example: 'Kathmandu', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    bank_address?: string;

    @ApiProperty({ description: 'Bank code', example: 123, required: false })
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value))
    bank_code?: number;

    @ApiProperty({ description: 'Website of the company', example: 'https://www.techcorp.com', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    website?: string;

    @IsOptional()
    company_logo?: Express.Multer.File;
    
}


  export class CreateCompanyDto {
    @ApiProperty({
      type: 'string',
      format: 'binary',
      description: 'The file to upload',
      required:false
    })
    @IsOptional()
    company_logo?: Express.Multer.File;
  
    @ApiProperty({
      type: ()=>baseDto,
      description: 'JSON data associated with the upload',
    })
    @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
    @ValidateNested()
    @IsObject()
    @Type(() => baseDto)
    data: baseDto;
  }