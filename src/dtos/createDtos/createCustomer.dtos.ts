import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateCustomerDto {
    @ApiProperty({ description: 'Name of the customer', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    name: string;

    @ApiProperty({ description: 'Phone number of the customer', example: '1234567890', required: false })
    @IsString()
    @IsOptional()
    @Length(10, 10)
    phone: string;

    @ApiProperty({ description: 'Email address of the customer', example: 'john.doe@example.com', required: false })
    @IsEmail()
    @IsOptional()
    @Length(1, 100)
    email: string;

    @ApiProperty({ description: 'Address of the customer', example: '123 Main St' })
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    address: string;

    @ApiProperty({ description: 'PAN number of the customer', example: 'ABCDE1234F', required: false })
    @IsString()
    @IsOptional()
    @Length(1, 100)
    pan: string;

    @ApiProperty({ description: 'Type of the customer', example: 'Individual', enum: ['Individual', 'Business'] })
    @IsEnum(['Individual', 'Business'])
    customer_type: 'Individual' | 'Business';

    @ApiProperty({ description: 'Notes about the customer', example: 'Preferred customer', required: false })
    @IsString()
    @IsOptional()
    notes: string;

    @ApiProperty({required:false,description:'given category will be include in this company id',example:'1'})
    @IsOptional()
    @IsString()
    companyId?:string

}