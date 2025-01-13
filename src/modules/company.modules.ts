import { Companies } from '../entities/Company.entities';
import { CompanyService } from './../services/company.services';
import { CompanyController } from './../controllers/company.controllers';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModules } from './Permission.modules';
import { Roles } from 'src/entities/Roles.entities';
import { Permission } from 'src/entities/permission.entites';


@Module({
  imports: [TypeOrmModule.forFeature([Companies,Roles,Companies,Permission]),PermissionModules],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [],
})
export class CompanyModule{}