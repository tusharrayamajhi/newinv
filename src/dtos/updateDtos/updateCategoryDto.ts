import { PartialType } from "@nestjs/swagger";
import { CreateCategoryDto } from "../createDtos/createCategory.dtos";


export class UpdateCategoryDto extends PartialType(CreateCategoryDto){}