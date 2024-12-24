import { Roles } from '../entities/Roles.entities';
import { RolesService } from './../services/role.services';
import { RolesController } from './../controllers/Roles.controllers';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModules } from './Permission.modules';
import { Permission } from 'src/entities/permission.entites';
import { Users } from 'src/entities/user.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Roles,Permission,Users]),PermissionModules],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [],
})
export class RolesModule{}