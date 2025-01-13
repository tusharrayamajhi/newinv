import { PartialType } from "@nestjs/swagger";
import { CreateVendor } from "../createDtos/createVendor.dtos";

export class updateVendor extends PartialType(CreateVendor){}