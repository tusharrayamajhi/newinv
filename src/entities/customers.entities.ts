import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntities } from './BaseEntities.entities';
import { Users } from './user.entities';
import { Companies } from './Company.entities';
import { Payment } from './payment.entities';
import { SalesDetails } from './SalesDetails.entities';
import { Refund } from './Refund.entities';

@Entity()
export class Customer extends BaseEntities {

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'char', length: 10, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pan: string;

  @ManyToOne(() => Users, (user) => user.customer, { nullable: true })
  createdBy: Users;

  @Column({
    type: 'enum',
    enum: ['Individual', 'Business'],
    default: 'Individual',
  })
  customer_type: 'Individual' | 'Business';

  // @Column({
  //   type: 'enum',
  //   enum: ['Cash', 'Credit', 'Bank Transfer', 'Cheque', 'Mobile Payment'],
  // })
  // payment_method: 'Cash' | 'Credit' | 'Bank Transfer' | 'Cheque' | 'Mobile Payment';

  // @Column({ type: 'decimal', precision: 10, scale: 2 })
  // amount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  // credit_amount: number;

  @OneToMany(() => SalesDetails, (sale) => sale.customer)
  salesDetails: SalesDetails[]

  @ManyToOne(() => Companies, (company) => company.customers)
  company: Companies

  @OneToMany(()=>Payment,(payment)=>payment.customer)
  payment:Payment[]

  @OneToMany(()=>Refund,(refund)=>refund.customer)
  refund: Refund[]

}
