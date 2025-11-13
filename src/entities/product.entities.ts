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
import { Companies } from './Company.entities';
import { PurchaseItem } from './PurchaseItem.entities';
import { salesItem } from './salesItem.entities';


@Entity()
export class Product extends BaseEntities {

    @Column({ type: 'varchar', length: 100, nullable: false })
    product_name: string;

    @Column({ type: 'text', nullable: true })
    product_description: string;

    @Column({ type: 'tinyint', default: 0 })
    vat: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true,default:0,unsigned:true })
    buying_rate: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true,default:0, unsigned:true })
    selling_rate: number;

    @Column({ type: 'int', unsigned: true, default: 0 })
    stock: number;

    @Column({type:"boolean",default:false})
    can_sale:boolean

    //relations
    @ManyToOne(() => Category, (category) => category.product, { nullable: true })
    category: Category;

    @ManyToOne(() => Users, (user) => user.product, { nullable: true })
    createdBy: Users;

    @ManyToOne(() => Brands, (brand) => brand.products, { nullable: true })
    brand: Brands;

    @ManyToOne(() => Units, (unit) => unit.products, { nullable: true })
    unit: Units;

    @Column({ type: 'int', unsigned: true, default: 0 })
    notificationThreshold: number;

    @OneToMany(() => PurchaseItem, (purchase) => purchase.product)
    purchase: PurchaseItem[]

    @OneToMany(() => salesItem, (sale) => sale.product)
    sales: salesItem[]

    // @OneToMany(()=>InvoiceReturn,(invoiceReturn)=>invoiceReturn.product)
    // salesReturn:InvoiceReturn[]

    @ManyToOne(() => Companies, (company) => company.products)
    company: Companies
}