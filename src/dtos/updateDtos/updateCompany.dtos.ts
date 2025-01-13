import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { baseDto } from '../createDtos/addCompany.dtos';

export class baseUpdateDto extends PartialType(baseDto) {}
export class UpdateCompanyDto{

  @ApiProperty({
    description: 'Company logo (optional for updates)',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_logo?: string;

  @ApiProperty({
    description: 'Updated company data (optional for updates)',
    type: () => baseUpdateDto,
  })
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @IsOptional()
  @IsObject()
  @Type(() => baseUpdateDto)
  data?: baseUpdateDto;
}

// Can be a file path or base64-encoded image data
  // @ApiProperty({ description: 'Name of the company', example: 'TechCorp',required: false })
  // company_name?: string;

  // @ApiProperty({ description: 'Unique code for the company', example: 'TECH001',required: false })
  // company_code?: string;

  // @ApiProperty({ description: 'Company registration number', example: '12345678',required: false })
  // registration_no?: string;

  // @ApiProperty({ description: 'Company phone number', example: '1234567890',required: false })
  // phone?: string;

  // @ApiProperty({ description: 'Company email address', example: 'info@techcorp.com',required: false })
  // email?: string;

  // @ApiProperty({ description: 'Company PAN or VAT number', example: 'PAN12345678',required: false })
  // pan_vat_no?: string;

  // @ApiProperty({ description: 'Company address', example: '123 Street, City',required: false })
  // address?: string;

  // @ApiProperty({ description: 'Country where the company is located', example: 'Nepal',required: false })
  // country?: string;

  // @ApiProperty({ description: 'State where the company is located', example: 'Province 3', required: false })
  // state?: string;

  // @ApiProperty({ description: 'City where the company is located', example: 'Kathmandu', required: false })
  // city?: string;

  // @ApiProperty({ description: 'ZIP code of the company address', example: 44600, required: false })
  // zip?: number;

  // @ApiProperty({ description: 'Name of the company bank', example: 'Nepal Bank', required: false })
  // bank_name?: string;

  // @ApiProperty({ description: 'Bank account number', example: '987654321', required: false })
  // account_no?: string;

  // @ApiProperty({ description: 'Branch of the bank', example: 'Durbar Marg', required: false })
  // bank_branch?: string;

  // @ApiProperty({ description: 'Address of the bank', example: 'Kathmandu', required: false })
  // bank_address?: string;

  // @ApiProperty({ description: 'Bank code', example: 123, required: false })
  // bank_code?: number;

  // @ApiProperty({ description: 'Website of the company', example: 'https://www.techcorp.com', required: false })
  // website?: string;

  // @ApiProperty({ description: 'upload company logo', type: "string", format: "binary", nullable: true,required:false })
  // company_logo?: string;
// }