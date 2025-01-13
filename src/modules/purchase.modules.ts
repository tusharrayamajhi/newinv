import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Companies } from "src/entities/Company.entities";
import { Product } from "src/entities/product.entities";
import { PurchaseItem } from "src/entities/PurchaseItem.entities";
import { PurchaseDetails } from "src/entities/purchaseDetails.entities";
import { Users } from "src/entities/user.entities";
import { Vendor } from "src/entities/vendors.entities";
import { PermissionModules } from "./Permission.modules";
import { PurchaseController } from "src/controllers/purchase.controllers";
import { purchaseService } from "src/services/purchase.services";
import { Payment } from "src/entities/payment.entities";


@Module({
  imports: [TypeOrmModule.forFeature([Users,Companies,Product,Vendor,Payment,PurchaseItem,PurchaseDetails]),PermissionModules],
  controllers: [PurchaseController],
  providers: [purchaseService],
  exports: [],
})
export class purchaseModule{}