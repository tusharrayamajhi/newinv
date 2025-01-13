import { BullModule } from '@nestjs/bullmq';
import { Users } from '../entities/user.entities';
import { UserService } from '../services/User.services';
import { Module } from "@nestjs/common";
import { UserController } from "../controllers/User.contollers";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from 'src/entities/Company.entities';
import { Roles } from 'src/entities/Roles.entities';
import { Permission } from 'src/entities/permission.entites';
import { PermissionModules } from './Permission.modules';
import { EmailProcessor } from 'src/processsor/email.processor';
import { EmailService } from 'src/services/Email.services';



@Module({
  imports: [
    TypeOrmModule.forFeature([Users,Companies,Roles,Permission]),
    PermissionModules,
    BullModule.registerQueue({
      name:"opt_email"
    }),
  ],
  controllers: [UserController],
  providers: [UserService,EmailService,EmailProcessor],
  exports: [],
})
export class UserModules{}