import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";
import { salesStatus } from "src/utils/enums/salesStatus.enums";
import { createSalesItemDto } from "./salesItem.dtos";
import { SalesPaymentDTO } from "./createSalesPayment.dtos";


export class SalesDetailsDto{

    @ApiProperty({ description: "this is the shipment information", enum: salesStatus, default: salesStatus.sent })
    @IsNotEmpty()
    @IsEnum(salesStatus,{message:"shipment status most be valid status from enum"})
    shipment_status: salesStatus;

    @ApiProperty({ description: "sales customer id", example: "customer id 1" })
    @IsNotEmpty()
    @IsString()
    customerId: string;

    @ApiProperty({ description: "remarks", example: "vendor id 1" })
    @IsOptional()
    @IsString()
    remark?: string;


    @ApiProperty({
        type: [createSalesItemDto],
        description: 'JSON data associated with the Sales item',
    })
    @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
    @ValidateNested()
    @IsArray()
    @Type(() => createSalesItemDto)
    salesItems:createSalesItemDto[];

    @ApiProperty({
        type:[SalesPaymentDTO],
        description: 'JSON data associated with the payment',
    })
    @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
    @ValidateNested()
    @IsArray()
    @Type(() => SalesPaymentDTO)
    payment:SalesPaymentDTO[];
}