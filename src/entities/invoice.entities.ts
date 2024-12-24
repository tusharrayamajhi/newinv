import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from './customers.entities';
import { Product } from './product.entities';
import { Users } from './user.entities';
import { BaseEntities } from './BaseEntities.entities';
import { InvoiceReturn } from './InvoiceReturn.entities';

@Entity('invoices') // Table name
export class Invoices extends BaseEntities {
 

  @Column({ type: 'varchar', length: 100, nullable: true })
  invoice_code: string;

  @ManyToOne(() => Customer, (customer) => customer.invoice)
  customer: Customer;

  @ManyToOne(() => Product, (product) => product.invoice)
  product: Product;

  @Column({ type: 'int', unsigned: true })
  Quantity: number;

  @Column({ type: 'int', unsigned: true })
  rate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  payment: string;

  @Column({ type: 'tinyint', default: 1 })
  vat: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  remark: string;

  @ManyToOne(() => Users, (user) => user.invoice, { nullable: false })
  createdBy: Users;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sales_date: Date;

  @OneToMany(()=>InvoiceReturn,(invoiceReturn)=>invoiceReturn.product)
  salesReturn:InvoiceReturn[]

}
