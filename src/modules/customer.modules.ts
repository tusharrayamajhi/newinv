import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Companies } from "src/entities/Company.entities";
import { Customer } from "src/entities/customers.entities";
import { Users } from "src/entities/user.entities";
import { CustomerService } from "src/services/customer.services";
import { PermissionModules } from "./Permission.modules";
import { CustomerController } from "src/controllers/customer.controllers";


@Module({
  imports: [TypeOrmModule.forFeature([Users,Companies,Customer]),PermissionModules],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [],
})
export class CustomerModule{}