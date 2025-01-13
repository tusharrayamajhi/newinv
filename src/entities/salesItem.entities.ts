import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";
import { Companies } from "./Company.entities";
import { Product } from "./product.entities";
import { SalesDetails } from "./SalesDetails.entities";


@Entity()
export class salesItem extends BaseEntities {

    @Column({ nullable: false, unsigned: false, type: "decimal" })
    quantity: number

    @Column({ nullable: false, type: "decimal", unsigned: false })
    unit_rate: number

    // @Column({ nullable: false, type: "decimal", unsigned: false })
    // cost_price: number

    @Column({ type: 'decimal', default: 0.0, unsigned: false })
    total_before_dis: number

    @Column({ type: 'decimal', default: 0.0, unsigned: false })
    discount_rate: number;

    @Column({ type: 'decimal', default: 0.0, unsigned: false })
    total_after_dis: number;

    @Column({ type: "decimal", default: 0.0, unsigned: false })
    tax_rate: number

    @Column({ type: 'decimal', default: 0.0 })
    total_after_tax: number;

    // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    // sales_date: Date

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @ManyToOne(() => Product, (product) => product.sales, { nullable: false })
    product: Product;

    @ManyToOne(()=>SalesDetails,(invoice)=>invoice.sales_item)
    SalesDetails:SalesDetails

    @ManyToOne(() => Companies, (company) => company.salesItem)
    company: Companies

}