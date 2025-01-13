import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BrandsController } from "../controllers/brand.controllers";
import { Brands } from "../entities/Brands.entities";
import { BrandService } from "../services/brand.services";
import { PermissionModules } from "./Permission.modules";
import { Companies } from "src/entities/Company.entities";
import { Users } from "src/entities/user.entities";



@Module({
  imports: [TypeOrmModule.forFeature([Brands,Companies,Users]),PermissionModules],
  controllers: [BrandsController],
  providers: [BrandService],
  exports: [],
})
export class BrandModule{}