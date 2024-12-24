import { Vendor } from './../entities/vendors.entities';
import { Units } from './../entities/units.entities';
import { Roles } from './../entities/Roles.entities';
import { Purchase } from './../entities/Purchase.entities';
import { Product } from './../entities/product.entities';
import { InvoiceReturn } from './../entities/InvoiceReturn.entities';
import { InvoiceDetails } from './../entities/invoiceDetails.entities';
import { Invoices } from './../entities/invoice.entities';
import { Brands } from './../entities/Brands.entities';
import { Category } from './../entities/Category.entities';
import { Users } from './../entities/user.entities';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {ConfigService } from '@nestjs/config';
import { Companies } from '../entities/Company.entities';
import { Customer } from '../entities/customers.entities';
import { PurchaseDetails } from '../entities/purchaseDetails.entities';
import { Permission } from '../entities/permission.entites';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory:async (configService:ConfigService)=>({
        type:"mysql",
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Brands,Category,Companies,Customer,Invoices,InvoiceDetails,InvoiceReturn,Permission,Product,Purchase,PurchaseDetails,Roles,Units,Users,Vendor],
        synchronize: true, // Should be false in production!
      }),
      inject: [ConfigService], 
      })
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule{}