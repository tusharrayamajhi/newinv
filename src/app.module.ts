
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from "./modules/auth.modules";
import { JwtModule } from "@nestjs/jwt";
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from "./modules/DatabaseModule.modules";
import { CompanyModule } from './modules/company.modules';
import { RolesModule } from './modules/Roles.modules';
import { PermissionModules } from './modules/Permission.modules';
import { UserModules } from "./modules/user.modues";
import { CategoryModule } from "./modules/Category.modules";
import { DiscoveryModule } from "@nestjs/core";


@Module({
  imports: [
    DiscoveryModule,
    CacheModule.register({isGlobal:true,ttl:0}),
    ConfigModule.forRoot({isGlobal:true,envFilePath:"./.env"}),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions:{
          expiresIn:"1h"
        }
      }),
    }),
    DatabaseModule,
    AuthModule,
    CompanyModule,
    RolesModule,
    PermissionModules,
    UserModules,
    CategoryModule
  ],
  controllers: [],
  providers: [],
  exports:[PermissionModules]
})
export class AppModule {}
