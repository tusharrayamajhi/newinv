import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class createSalesItemDto{

    @ApiProperty({description:"enter a quantity you want to sell" ,example:10})
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity:number

    @ApiProperty({description:"enter product id",example:"product id 1"})
    @IsNotEmpty()
    @IsString()
    productId:string

    @ApiProperty({description:"dis rate if product have discount" ,example:5,required:false})
    @IsOptional()
    @IsNumber()
    discount_rate?:number

    @ApiProperty({description:"per quantity rate",example:100})
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    unit_rate: number;

    @ApiProperty({description:"sales date",example:"2024/12/29"})
    @IsNotEmpty()
    @IsString()
    sales_date: string;

    @ApiProperty({description:"extra information",example:"this is sales",required:false})
    @IsOptional()
    @IsString()
    remarks?: string;
}