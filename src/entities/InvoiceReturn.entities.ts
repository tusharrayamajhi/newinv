import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";
import { Product } from "./product.entities";
import { Invoices } from "./invoice.entities";
import { Users } from "./user.entities";


@Entity()
export class InvoiceReturn extends BaseEntities {

    @Column({ type: 'int', unsigned: true })
    return_quantity: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    return_reason: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    return_date: Date;

    @ManyToOne(()=>Product,(product)=>product.salesReturn)
    product:Product

    @ManyToOne(()=>Invoices,(invoice)=>invoice.salesReturn)
    invoice:Invoices

    @ManyToOne(()=>Users,(user)=>user.salesReturn)
    processBy:Users

}