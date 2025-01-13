import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"


export class addBrandDto {

    @ApiProperty({description:"enter brand name",example:"Apple"})
    @IsString()
    @IsNotEmpty()
    brandName: string

    @ApiProperty({description:"enter brand description",example:"this is Apple brands"})
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty({required:false,description:"enter a company id ",example:"1"})
    @IsString()
    @IsOptional()
    companyId?:string

}