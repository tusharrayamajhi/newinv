import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail} from 'class-validator';

export class CreateVendor {
    @ApiProperty({ description: 'Name of the vendor', example: 'Vendor Inc.' })
    @IsString()
    vendor_name: string;

    @ApiProperty({ description: 'Description of the vendor', example: 'A vendor of electronic goods', required: false })
    @IsOptional()
    @IsString()
    vendor_description: string;

    @ApiProperty({ description: 'Email of the vendor', example: 'vendor@example.com', required: false })
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Phone number of the vendor', example: '1234567890' })
    @IsString()
    phone: string;

    @ApiProperty({ description: 'GST/VAT/PAN number of the vendor', example: 'GST123456' })
    @IsString()
    tax_number: string;

    @ApiProperty({ description: 'Country of the vendor', example: 'USA' })
    @IsString()
    country: string;

    @ApiProperty({ description: 'State of the vendor', example: 'California', required: false })
    @IsOptional()
    @IsString()
    state: string;

    @ApiProperty({ description: 'Address of the vendor', example: '123 Vendor St.' })
    @IsString()
    address: string;

    @ApiProperty({ description: 'Bank name of the vendor', example: 'citizen bank', required: false })
    @IsOptional()
    @IsString()
    bank_name: string;

    @ApiProperty({ description: 'Bank account number of the vendor', example: '1234567890', required: false })
    @IsOptional()
    @IsString()
    bank_account_number: string;

    @ApiProperty({ description: 'Bank SWIFT code of the vendor', example: 'CTZN', required: false })
    @IsOptional()
    @IsString()
    bank_swift_code: string;

    @ApiProperty({ description: 'Bank branch of the vendor', example: 'Main Branch', required: false })
    @IsOptional()
    @IsString()
    bank_branch: string;

    @ApiProperty({ required: false, description: 'given category will be include in this company id', example: '1' })
    @IsOptional()
    @IsString()
    companyId?: string
}
