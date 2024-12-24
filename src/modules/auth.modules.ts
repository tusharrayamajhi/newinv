import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entities';
import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controllers";
import { AuthService } from "../services/Auth.services";


@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule{}