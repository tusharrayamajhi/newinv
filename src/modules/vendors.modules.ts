import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Companies } from "src/entities/Company.entities";
import { Users } from "src/entities/user.entities";
import { Vendor } from "src/entities/vendors.entities";
import { PermissionModules } from "./Permission.modules";
import { VendorController } from "src/controllers/vendor.controllers";
import { VendorService } from "src/services/vendor.services";



@Module({
  imports: [TypeOrmModule.forFeature([Users,Vendor,Companies]),PermissionModules],
  controllers: [VendorController],
  providers: [VendorService],
  exports: [],
})
export class VendorModule{}