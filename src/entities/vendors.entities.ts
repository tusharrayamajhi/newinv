import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { BaseEntities } from './BaseEntities.entities';
  import { Users } from './user.entities';
import { Companies } from './Company.entities';
import { PurchaseDetails } from './purchaseDetails.entities';
import { Payment } from './payment.entities';
import { Refund } from './Refund.entities';
  
  @Entity()
  export class Vendor extends BaseEntities {
    @Column({ type: 'varchar', length: 100, nullable: false })
    vendor_name: string;
  
    @Column({ type: 'text', nullable: true })
    vendor_description: string;
  
    @Column({ type: 'varchar', length: 50, nullable: true })
    email: string;
  
    @Column({ type: 'char', length: 10, nullable: false })
    phone: string;
  
    @Column({ type: 'varchar', length: 30, nullable: false })
    tax_number: string;
  
    @Column({ type: 'varchar', length: 50, nullable: false })
    country: string;
  
    @Column({ type: 'varchar', length: 50, nullable: true })
    state: string;
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    address: string;
  
    @Column({ type: 'varchar', length: 100, nullable: true })
    bank_name: string;
  
    @Column({ type: 'varchar', length: 30, nullable: true })
    bank_account_number: string;
  
    @Column({ type: 'varchar', length: 20, nullable: true })
    bank_swift_code: string;
  
    @Column({ type: 'varchar', length: 100, nullable: true })
    bank_branch: string;
  
    @ManyToOne(() => Users, (user) => user.vendor, { nullable: false })
    createdBy: Users;

    @OneToMany(()=>PurchaseDetails,(purchase)=>purchase.vendor)
    purchaseDetails:PurchaseDetails[]

    @ManyToOne(() => Companies, (company) => company.vendors)
    company: Companies

    @OneToMany(()=>Payment,(payment)=>payment.vendor)
    payment:Payment[]

    @OneToMany(()=>Refund,(refund)=>refund.vendor)
    refund:Refund[]
  }
  