import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entities';
import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controllers";
import { AuthService } from "../services/Auth.services";
import { PermissionModules } from './Permission.modules';
import { BullModule } from '@nestjs/bullmq';
import { EmailService } from 'src/services/Email.services';
import { EmailProcessor } from 'src/processsor/email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: "opt_email",
    }),
    TypeOrmModule.forFeature([Users]),
    PermissionModules,

  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, EmailProcessor],
  exports: [],
})
export class AuthModule { }