import { Entity, Column, ManyToOne, } from 'typeorm';
import { Customer } from './customers.entities';
import { Vendor } from './vendors.entities';
import { PurchaseDetails } from './purchaseDetails.entities';
import { Companies } from './Company.entities';
import { BaseEntities } from './BaseEntities.entities';
import { paymentEnum } from 'src/utils/enums/payment.enums';
import { SalesDetails } from './SalesDetails.entities';

@Entity()
export class Payment extends BaseEntities{

  @Column({
    type: 'enum',
    enum: paymentEnum,
    default: paymentEnum.cash,
  })
  payment_method: paymentEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Customer, (customer) => customer.payment,{nullable:true})
  customer: Customer;

  @ManyToOne(() => Vendor, (vendor) => vendor.payment,{nullable:true})
  vendor: Vendor;

  @Column({ nullable: true, type: "text" })
  remark: string

  @ManyToOne(() => Companies, (company) => company.payment)
  company: Companies

  @ManyToOne(() => PurchaseDetails, (purchaseDetails) => purchaseDetails.payments)
  purchaseDetails: PurchaseDetails

  @ManyToOne(() => SalesDetails, (SalesDetails) => SalesDetails.payments)
  SalesDetails:SalesDetails
}