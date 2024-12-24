import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntities } from './BaseEntities.entities';
import { Users } from './user.entities';
import { Invoices } from './invoice.entities';

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

  @Column({
    type: 'enum',
    enum: ['Cash', 'Credit', 'Bank Transfer'],
    default: 'Cash',
  })
  payment_method: 'Cash' | 'Credit' | 'Bank Transfer';

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(()=>Invoices,(invoice)=>invoice.customer)
  invoice:Invoices[]
}
