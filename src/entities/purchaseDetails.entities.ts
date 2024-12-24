import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";
import { Purchase } from "./Purchase.entities";


@Entity()
export class PurchaseDetails extends BaseEntities {

    @Column({ type: 'decimal', precision: 20, scale: 5, default: 0.0, })
    total_before_tax: number;

    @Column({
        type: 'enum',
        enum: ['pending', 'received', 'partial received', 'cancelled', 'in process'],
        default: 'received',
    })
    status: 'pending' | 'received' | 'partial received' | 'cancelled' | 'in process';

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    tax_amount: number;

    @Column({ type: 'decimal', precision: 20, scale: 5, default: 0.0 })
    total_after_tax: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    discount: number;

    @OneToMany(()=>Purchase,(purchase)=>purchase.purchase_code)
    purchase:Purchase[]
}