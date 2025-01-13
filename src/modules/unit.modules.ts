import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UnitsController } from "src/controllers/unit.controllers";
import { Companies } from "src/entities/Company.entities";
import { Units } from "src/entities/units.entities";
import { Users } from "src/entities/user.entities";
import { UnitService } from "src/services/unit.services";
import { PermissionModules } from "./Permission.modules";


@Module({
  imports: [
    TypeOrmModule.forFeature([Users,Units,Companies]),
    PermissionModules,
    
  ],
  controllers: [UnitsController],
  providers: [UnitService],
  exports: [],
})
export class unitsModule{}