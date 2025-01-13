import { IsString, IsNumber, IsOptional, IsInt, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProductDto {

    @ApiProperty({ description: 'Name of the product', example: 'Laptop',required:true })
    @IsNotEmpty()
    @IsString()
    product_name: string;

    @ApiProperty({ description: 'Description of the product', example: 'A high-end gaming laptop', required: false })
    @IsNotEmpty()
    @IsString()
    product_description: string;

    @ApiProperty({ description: 'VAT percentage', example: 1,required:true })
    @IsInt()
    vat: number;

    @ApiProperty({ description: 'Buying rate of the product', example: 1000.00, required: false })
    @IsOptional()
    @IsNumber()
    buying_rate?: number;

    @ApiProperty({ description: 'Selling rate of the product', example: 1200.00, required: false })
    @IsOptional()
    @IsNumber()
    selling_rate?: number;

    @ApiProperty({ description: 'is product available for sales', example: false })
    @IsNotEmpty()
    @IsBoolean()
    can_sales?: boolean;

    @ApiProperty({ description: 'Category ID', example: 1 })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ description: 'notification threshold', example: 1 })
    notificationThreshold?: number;

    @ApiProperty({ description: 'Brand ID', example: 1 })
    @IsOptional()
    @IsString()
    brandId?: string;

    @ApiProperty({required:false, description: 'Unit ID', example: 1 })
    @IsOptional()
    @IsString()
    unitId?: string;

    @ApiProperty({ description: 'Company ID', example: 1, required: false })
    @IsOptional()
    companyId?: string;
}
