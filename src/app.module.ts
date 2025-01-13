
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
import { BrandModule } from "./modules/brand.modules";
import { unitsModule } from "./modules/unit.modules";
import { CustomerModule } from "./modules/customer.modules";
import { productModule } from "./modules/product.modules";
import { purchaseModule } from "./modules/purchase.modules";
import { VendorModule } from "./modules/vendors.modules";
import { salesModule } from "./modules/sales.modules";
import { BullModule } from "@nestjs/bullmq";
import { ReportModule } from "./modules/report.modules";


@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: 0 }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "./.env" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: "1h"
        },
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>("REDIS_URL")
          // host:"127.0.0.1",
          // port:6379
        }
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    CompanyModule,
    RolesModule,
    PermissionModules,
    UserModules,
    CategoryModule,
    BrandModule,
    unitsModule,
    CustomerModule,
    productModule,
    purchaseModule,
    VendorModule,
    salesModule,
    ReportModule
  ],
  controllers: [],
  providers: [],
  exports: [PermissionModules]
})
export class AppModule { }

