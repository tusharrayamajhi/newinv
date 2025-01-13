import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { paymentEnum } from 'src/utils/enums/payment.enums';




export class PurchasePaymentDTO {
  @ApiProperty({
    description: 'The method of payment',
    enum: paymentEnum,
    example: 'cash',
  })
  @IsEnum(paymentEnum,{message:"payment most be a type of enum"})
  @IsNotEmpty()
  payment_method: paymentEnum;

  @ApiProperty({
    description: 'The amount of the payment',
    example: 500,
  })
  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Optional remarks or notes about the payment',
    example: 'Paid in full',
    required: false,
  })
  @IsString()
  @IsOptional()
  remark?: string;
}
