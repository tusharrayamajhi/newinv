import { Permission } from '../entities/permission.entites';
import { PermissionService } from './../services/Permission.services';
import { PermissionController } from './../controllers/Permission.controllers';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/user.entities';
import { Roles } from 'src/entities/Roles.entities';


@Module({
  imports: [TypeOrmModule.forFeature([Permission,Users,Roles])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModules{}