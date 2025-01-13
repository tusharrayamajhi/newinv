import { Vendor } from './../entities/vendors.entities';
import { Units } from './../entities/units.entities';
import { Roles } from './../entities/Roles.entities';
import { PurchaseItem } from './../entities/PurchaseItem.entities';
import { Product } from './../entities/product.entities';
import { Brands } from './../entities/Brands.entities';
import { Category } from './../entities/Category.entities';
import { Users } from './../entities/user.entities';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from '@nestjs/config';
import { Companies } from '../entities/Company.entities';
import { Customer } from '../entities/customers.entities';
import { PurchaseDetails } from '../entities/purchaseDetails.entities';
import { Permission } from '../entities/permission.entites';
import { Payment } from 'src/entities/payment.entities';
import { salesItem } from 'src/entities/salesItem.entities';
import { SalesDetails } from 'src/entities/SalesDetails.entities';
import { Refund } from 'src/entities/Refund.entities';
import { PurchaseReturnDetails } from 'src/entities/purchaseReutrnDetails.entities';
import { purchaseReturnItem } from 'src/entities/purchaseReturnItem.entities';
import { SalesReturnDetails } from 'src/entities/salesReturnDetails.entities';
import { SalesReturnItem } from 'src/entities/salesReturnItem.entities';


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
        entities: [Brands,SalesReturnDetails,SalesReturnItem,Refund,PurchaseReturnDetails,purchaseReturnItem,Category,Companies,Customer,SalesDetails,salesItem,Permission,Product,Payment,PurchaseItem,PurchaseDetails,Roles,Units,Users,Vendor],
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