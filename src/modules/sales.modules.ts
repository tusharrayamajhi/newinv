import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Companies } from "src/entities/Company.entities";
import { Customer } from "src/entities/customers.entities";
import { Payment } from "src/entities/payment.entities";
import { Product } from "src/entities/product.entities";
import { Users } from "src/entities/user.entities";
import { PermissionModules } from "./Permission.modules";
import { salesController } from "src/controllers/sales.controllers";
import { salesService } from "src/services/sales.services";
import { salesItem } from "src/entities/salesItem.entities";
import { SalesDetails } from "src/entities/SalesDetails.entities";
import { PurchaseDetails } from "src/entities/purchaseDetails.entities";
import { PurchaseItem } from "src/entities/PurchaseItem.entities";


@Module({
  imports: [TypeOrmModule.forFeature([Users,Companies,Customer,Product,Payment,salesItem,SalesDetails,PurchaseDetails,PurchaseItem]),PermissionModules],
  controllers: [salesController],
  providers: [salesService],
  exports: [],
})
export class salesModule{

}