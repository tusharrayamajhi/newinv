import { PartialType } from "@nestjs/swagger";
import { AddProductDto } from "../createDtos/addProduct.dtos";


export class UpdateProdcutDtos extends PartialType(AddProductDto){}