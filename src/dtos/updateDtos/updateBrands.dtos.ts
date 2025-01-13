import { PartialType } from "@nestjs/swagger";
import { addBrandDto } from "../createDtos/addBrands.dtos";


export class UpdateBrandDto extends PartialType(addBrandDto){}