import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";
import { PurchaseItemDto } from "./createpurchaseItem.dtos";
import { PurchasePaymentDTO } from "./createPurchasePayment.dtos";
import { purchaseStatus } from "src/utils/enums/purchaseStatus.enums";




export class PurchaseDetail{

    @ApiProperty({ description: "this is the shipment information", enum: purchaseStatus, default: purchaseStatus.received })
    @IsNotEmpty()
    @IsEnum(purchaseStatus,{message:"shipment status most be valid status from enum"})
    shipment_status: purchaseStatus;

    @ApiProperty({ description: "discount rate in total purchase", example: 5, default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    discountInTotalPurchase?: number;

    @ApiProperty({ description: "discount rate in total purchase", example: 5, default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    taxInTotalPurchase?: number;

    @ApiProperty({ description: "from which vendor do you purchase", example: "vendor id 1" })
    @IsNotEmpty()
    @IsString()
    vendorId: string;

    @ApiProperty({ description: "remarks", example: "vendor id 1" })
    @IsOptional()
    @IsString()
    remark?: string;


    @ApiProperty({
        type: [PurchaseItemDto],
        description: 'JSON data associated with the purchase item',
    })
    @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
    @ValidateNested()
    @IsArray()
    @Type(() => PurchaseItemDto)
    purchaseItems:PurchaseItemDto[];

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
        type:[PurchasePaymentDTO],
        description: 'JSON data associated with the payment',
    })
    @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
    @ValidateNested()
    @IsArray()
    @Type(() => PurchasePaymentDTO)
    payment:PurchasePaymentDTO[];
}