import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportController } from "src/controllers/Report.controllers";
import { Brands } from "src/entities/Brands.entities";
import { Category } from "src/entities/Category.entities";
import { Companies } from "src/entities/Company.entities";
import { Customer } from "src/entities/customers.entities";
import { Payment } from "src/entities/payment.entities";
import { Product } from "src/entities/product.entities";
import { PurchaseDetails } from "src/entities/purchaseDetails.entities";
import { PurchaseItem } from "src/entities/PurchaseItem.entities";
import { Roles } from "src/entities/Roles.entities";
import { SalesDetails } from "src/entities/SalesDetails.entities";
import { salesItem } from "src/entities/salesItem.entities";
import { Units } from "src/entities/units.entities";
import { Users } from "src/entities/user.entities";
import { Vendor } from "src/entities/vendors.entities";
import { ReportService } from "src/services/Report.services";
import { PermissionModules } from "./Permission.modules";


@Module({
  imports: [
    PermissionModules,
    TypeOrmModule.forFeature([Users,Brands,Category,Companies,Customer,Payment,Product,PurchaseDetails,PurchaseItem,Roles,SalesDetails,salesItem,Units,Vendor])
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [],
})
export class ReportModule{}