import { Companies } from '../entities/Company.entities';
import { CompanyService } from './../services/company.services';
import { CompanyController } from './../controllers/company.controllers';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModules } from './Permission.modules';


@Module({
  imports: [TypeOrmModule.forFeature([Companies]),PermissionModules],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [],
})
export class CompanyModule{}