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

    @ApiProperty({ description: "discount rate in total sales", example: 5, default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    discount_in_total_sales?: number;

    @ApiProperty({ description: "discount rate in total sales", example: 5, default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    tax_in_total_sales?: number;

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

    // @ApiProperty({
    //     type: () => Details,
    //     description: 'JSON data associated with the upload',
    // })
    // @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
    // @ValidateNested()
    // @IsObject()
    // @Type(() => Details)
    // purchaseDetails:Details;

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