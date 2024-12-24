import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";
import { Invoices } from "./invoice.entities";


@Entity()
export class InvoiceDetails extends BaseEntities {

    @Column({ type: 'decimal', precision: 20, scale: 5, default: 0.0, })
    total_before_tax: number;

    @Column({
        type: 'enum',
        enum: ['pending', 'received', 'partial received', 'cancelled', 'in process'],
        default: 'received',
    })
    payment_status: 'pending' | 'received' | 'partial received' | 'cancelled' | 'in process';

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    taxable_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    tax_amount: number;

    @Column({ type: 'decimal', precision: 20, scale: 5, default: 0.0 })
    total_after_tax: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    discount: number;

    @Column({ type: 'decimal', precision: 20, scale: 5, default: 0.0 })
    total_after_discount: number;

    @OneToMany(()=>Invoices,(invoice)=>invoice.invoice_code)
    invoice:Invoices[]
}