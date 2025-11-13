import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { SalesPaymentDTO } from "../createDtos/createSalesPayment.dtos";
import { createSalesItemDto } from "../createDtos/salesItem.dtos";
import { salesStatus } from "src/utils/enums/salesStatus.enums";


class updatePayment extends PartialType(SalesPaymentDTO) { 
    @ApiProperty({ description: "payment item id", example: " id 1" })
    @IsNotEmpty()
    @IsString()
    id:string
}
class updateSalesItem extends PartialType(createSalesItemDto) {
    @ApiProperty({ description: "purchase item id", example: " id 1" })
    @IsNotEmpty()
    @IsString()
    id:string
 }
export class updateSales {
    @ApiProperty({ description: "this is the shipment information", required:false,enum: salesStatus, default: salesStatus.sent })
    @IsNotEmpty()
    @IsEnum(salesStatus, { message: "shipment status most be valid status from enum" })
    shipment_status?: salesStatus;


    @ApiProperty({ required:false,description: "from which vendor do you purchase", example: "vendor id 1" })
    @IsOptional()
    @IsString()
    customerId?: string;

    @ApiProperty({ required:false,description: "remarks", example: "vendor id 1" })
    @IsOptional()
    @IsString()
    remark?: string;


    @ApiProperty({
        type: [updateSalesItem],
        description: 'JSON data associated with the upload',
        required:false
    })
    @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
    @ValidateNested()
    @IsArray()
    @IsOptional()
    @Type(() => updateSalesItem)
    salesItems?: updateSalesItem[];


    @ApiProperty({
        type: [updatePayment],
        description: 'JSON data associated with the upload',
        required:false
    })
    @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
    @ValidateNested()
    @IsArray()
    @IsOptional()
    @Type(() => updatePayment)
    payment?: updatePayment[];
}