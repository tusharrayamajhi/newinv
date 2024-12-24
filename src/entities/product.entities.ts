import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { BaseEntities } from './BaseEntities.entities';
import { Brands } from './Brands.entities';
import { Units } from './units.entities';
import { Users } from './user.entities';
import { Category } from './Category.entities';
import { Purchase } from './Purchase.entities';
import { Invoices } from './invoice.entities';
import { InvoiceReturn } from './InvoiceReturn.entities';


@Entity()
export class Product extends BaseEntities {

    @Column({ type: 'varchar', length: 100, nullable: false })
    product_name: string;

    @Column({ type: 'text', nullable: true })
    product_description: string;

    @Column({ type: 'tinyint', default: 0 })
    vat: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    buying_rate: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    selling_rate: number;

    @Column({ type: 'int', unsigned: true, default: 0 })
    stock: number;

    //relations
    @ManyToOne(() => Category, (category) => category.product, { nullable: false })
    category: Category;

    @ManyToOne(() => Users, (user) => user.product, { nullable: false })
    createdBy: Users;

    @ManyToOne(() => Brands, (brand) => brand.products, { nullable: false })
    brand: Brands;

    @ManyToOne(() => Units, (unit) => unit.products, { nullable: false })
    unit: Units;

    @OneToMany(() => Purchase, (purchase) => purchase.product)
    purchase: Purchase

    @OneToMany(() => Invoices, (invoice) => invoice.product)
    invoice: Invoices[]

    @OneToMany(()=>InvoiceReturn,(invoiceReturn)=>invoiceReturn.product)
    salesReturn:InvoiceReturn[]
}