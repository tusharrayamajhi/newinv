import { PartialType } from "@nestjs/swagger";
import { createUnitsDto } from "../createDtos/addunit.dtos";


export class UpdateUnitDto extends PartialType(createUnitsDto){}