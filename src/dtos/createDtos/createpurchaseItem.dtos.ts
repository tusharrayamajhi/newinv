import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min} from "class-validator";


export class PurchaseItemDto{

    // @ApiProperty({description:"purchase quantity",example:50})
    // @IsNotEmpty()
    // @IsNumber()
    // @Min(0)
    // ordered_qnt: number;

    @ApiProperty({description:"received quantity",example:50})
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    // @Validate((dto:PurchaseItemDto)=> dto.received_qnt <= dto.ordered_qnt)
    received_qnt: number;

    @ApiProperty({description:"per quantity rate",example:100})
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    unit_rate: number;

    // @ApiProperty({description:"tax percentage in product",example:15})
    // @IsNotEmpty()
    // @IsNumber()
    // @Min(0)
    // @Max(100)
    // tax_rate: number;

    @ApiProperty({description:"purchase date",example:"2024/12/29"})
    @IsNotEmpty()
    @IsString()
    purchase_date: string;

    @ApiProperty({description:"extra information",example:"this is purchased",required:false})
    @IsOptional()
    @IsString()
    remarks?: string;

    @ApiProperty({description:"which product that is purchase from vendor",example:"product id 1"})
    @IsNotEmpty()
    @IsString()
    productId: string;

    @ApiProperty({description:"discount rate is given in particular product",example:5})
    @IsOptional()
    @IsNumber()
    discount_rate?: number;

}
