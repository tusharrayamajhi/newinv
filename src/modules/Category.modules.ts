import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryController } from "../controllers/Category.controllers";
import { Category } from "../entities/Category.entities";
import { categoryService } from "../services/Category.services";
import { PermissionModules } from "./Permission.modules";
import { Companies } from "src/entities/Company.entities";
import { Users } from "src/entities/user.entities";



@Module({
  imports: [TypeOrmModule.forFeature([Category,Companies,Users]),PermissionModules],
  controllers: [CategoryController],
  providers: [categoryService],
  exports: [],
})
export class CategoryModule {}