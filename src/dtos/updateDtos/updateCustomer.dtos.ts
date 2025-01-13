import { PartialType } from "@nestjs/swagger";
import { CreateCustomerDto } from "../createDtos/createCustomer.dtos";


export class updateCustomerDto extends PartialType(CreateCustomerDto){}