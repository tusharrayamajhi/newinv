import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";
import { PurchaseReturnDetails } from "./purchaseReutrnDetails.entities";
import { PurchaseItem } from "./PurchaseItem.entities";


@Entity()
export class purchaseReturnItem extends BaseEntities{

    @Column({type:'datetime'})
    return_date:Date

    @Column({ type: 'text' })
    reason:string

    @Column({type:'decimal',default:0.0})
    return_quantity:number

    @OneToOne(()=>PurchaseItem,(purchaseItem)=>purchaseItem.purchaseReturnItem)
    returnItem:PurchaseItem

    @ManyToOne(() => PurchaseReturnDetails, (purchaseReturn) => purchaseReturn.returnItem)
    purchaseReturnDetails:PurchaseReturnDetails

}