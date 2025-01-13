import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Brands } from "src/entities/Brands.entities";
import { Category } from "src/entities/Category.entities";
import { Companies } from "src/entities/Company.entities";
import { Product } from "src/entities/product.entities";
import { Units } from "src/entities/units.entities";
import { Users } from "src/entities/user.entities";
import { PermissionModules } from "./Permission.modules";
import { ProductService } from "src/services/product.services";
import { ProductController } from "src/controllers/product.controllers";


@Module({
  imports: [TypeOrmModule.forFeature([Users,Companies,Brands,Units,Category,Product]),PermissionModules],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [],
})
export class productModule{}