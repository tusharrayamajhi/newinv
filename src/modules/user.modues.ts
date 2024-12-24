import { Users } from '../entities/user.entities';
import { UserService } from '../services/User.services';
import { Module } from "@nestjs/common";
import { UserController } from "../controllers/User.contollers";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from 'src/entities/Company.entities';
import { Roles } from 'src/entities/Roles.entities';
import { Permission } from 'src/entities/permission.entites';
import { PermissionModules } from './Permission.modules';



@Module({
  imports: [TypeOrmModule.forFeature([Users,Companies,Roles,Permission]),PermissionModules],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModules{}