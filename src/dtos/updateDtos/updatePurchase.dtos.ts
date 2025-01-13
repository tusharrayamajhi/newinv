import { ApiProperty, PartialType } from "@nestjs/swagger";
import { PurchasePaymentDTO } from "../createDtos/createPurchasePayment.dtos";
import { PurchaseItemDto } from "../createDtos/createpurchaseItem.dtos";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";
import { purchaseStatus } from "src/utils/enums/purchaseStatus.enums";
import { Transform, Type } from "class-transformer";


class updatePayment extends PartialType(PurchasePaymentDTO) { 
    @ApiProperty({ description: "payment item id", example: " id 1" })
    @IsNotEmpty()
    @IsString()
    id:string
}
class updatePurchaseItem extends PartialType(PurchaseItemDto) {
    @ApiProperty({ description: "purchase item id", example: " id 1" })
    @IsNotEmpty()
    @IsString()
    id:string
 }
export class updatePurchase {
    @ApiProperty({ description: "this is the shipment information", required:false,enum: purchaseStatus, default: purchaseStatus.received })
    @IsNotEmpty()
    @IsEnum(purchaseStatus, { message: "shipment status most be valid status from enum" })
    shipment_status?: purchaseStatus;

    @ApiProperty({required:false, description: "discount rate in total purchase", example: 5, default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    discountInTotalPurchase?: number;

    @ApiProperty({ required:false,description: "discount rate in total purchase", example: 5, default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    taxInTotalPurchase?: number;

    @ApiProperty({ required:false,description: "from which vendor do you purchase", example: "vendor id 1" })
    @IsOptional()
    @IsString()
    vendorId?: string;

    @ApiProperty({ required:false,description: "remarks", example: "vendor id 1" })
    @IsOptional()
    @IsString()
    remark?: string;


    @ApiProperty({
        type: [updatePurchaseItem],
        description: 'JSON data associated with the upload',
        required:false
    })
    @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
    @ValidateNested()
    @IsArray()
    @IsOptional()
    @Type(() => updatePurchaseItem)
    purchaseItems?: updatePurchaseItem[];

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