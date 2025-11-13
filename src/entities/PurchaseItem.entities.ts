import { Entity, Column, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntities } from './BaseEntities.entities';
import { Product } from './product.entities';
import { PurchaseDetails } from './purchaseDetails.entities';
import { Companies } from './Company.entities';
import { purchaseReturnItem } from './purchaseReturnItem.entities';

@Entity()
export class PurchaseItem extends BaseEntities {

    @Column({ type: 'int', unsigned: true })
    ordered_qnt: number;

    @Column({ type: 'int', unsigned: true, default: 0 })
    received_qnt: number;

    @Column({ type: 'int',})
    balance: number;

    @Column({ type: 'decimal', unsigned: true })
    unit_rate: number;

    @Column({ type: 'int', nullable: true })
    tax_rate: number;

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @Column({nullable:false,type:"decimal"})
    total:number

    @ManyToOne(() => Product, (product) => product.purchase, { nullable: false,eager:true })
    product: Product;

    @Column({ type: 'decimal', default: 0.0 })
    discount_rate: number;

    @Column({ type: 'decimal', default: 0.0 })
    totalAfterDis: number;

    @Column({ type: 'decimal', default: 0.0 })
    totalAfterTax: number;

    @ManyToOne(() => PurchaseDetails, (purchaseDetail) => purchaseDetail.purchases)
    purchaseDetails: PurchaseDetails

    @OneToOne(()=>purchaseReturnItem,(purchaseReturnItem)=>purchaseReturnItem.returnItem)
    purchaseReturnItem:purchaseReturnItem

    @ManyToOne(() => Companies, (company) => company.purchaseItem)
    company: Companies

}
