import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntities } from './BaseEntities.entities';
import { Vendor } from './vendors.entities';
import { Product } from './product.entities';
import { Users } from './user.entities';

@Entity()
export class Purchase extends BaseEntities {
    @Column({ type: 'varchar', length: 100, nullable: true })
    purchase_code: string;

    @Column({ type: 'int', unsigned: true })
    ordered_qnt: number;

    @Column({ type: 'int', unsigned: true, default: 0 })
    received_qnt: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, unsigned: true })
    unit_rate: number;

    @Column({ type: 'int', nullable: true })
    tax_rate: number;

    @Column({ type: 'int', nullable: true })
    balance: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    purchase_date: Date;

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @Column({ type: 'int', default: 0 })
    remaining: number;

    @ManyToOne(() => Vendor, (vendor) => vendor.purchase, { nullable: false })
    vendor: Vendor;

    @ManyToOne(() => Product, (product) => product.purchase, { nullable: false })
    product: Product;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    discount: number;

    @ManyToOne(() => Users, (user) => user.purchase, { nullable: false })
    purchasedBy: Users;
}
