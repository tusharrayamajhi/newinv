import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryController } from "../controllers/Category.controllers";
import { Category } from "../entities/Category.entities";
import { categoryService } from "../services/Category.services";
import { PermissionModules } from "./Permission.modules";



@Module({
  imports: [TypeOrmModule.forFeature([Category]),PermissionModules],
  controllers: [CategoryController],
  providers: [categoryService],
  exports: [],
})
export class CategoryModule {}