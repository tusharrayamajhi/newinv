import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateCategoryDto{
    
    @ApiProperty({name:'name',description:'Name of the category',example:'Electronics'})
    @IsNotEmpty()
    @IsString()
    name:string

    @ApiProperty({name:'description',description:'Description of the category',example:'All electronics items'})
    @IsOptional()
    @IsString()
    description?:string

    @ApiProperty({required:false,description:'given category will be include in this company id',example:'1'})
    @IsOptional()
    @IsString()
    companyId?:string
}