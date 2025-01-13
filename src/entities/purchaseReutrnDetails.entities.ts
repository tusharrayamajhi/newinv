import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";
import { PurchaseDetails } from "./purchaseDetails.entities";
import { purchaseReturnItem } from "./purchaseReturnItem.entities";
import { Refund } from "./Refund.entities";
import { purchaseStatus } from "src/utils/enums/purchaseStatus.enums";


@Entity()
export class PurchaseReturnDetails extends BaseEntities {

  @Column({
    type: 'enum',
    enum: purchaseStatus,
    default: purchaseStatus.pending,
  })
  purchase_return_status: purchaseStatus

  @Column({ type: 'datetime' })
  return_date: Date

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  additional_expenses: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discounts: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_adjusted_refund: number;

  @Column({ type: 'text', nullable: true })
  reason: string

  @OneToMany(() => purchaseReturnItem, (purchaseReturnItem) => purchaseReturnItem.purchaseReturnDetails)
  returnItem: purchaseReturnItem[]

  @OneToOne(() => PurchaseDetails,(purchaseDetails)=>purchaseDetails.purchases_return_details)
  purchaseDetails: PurchaseDetails

  @OneToMany(() => Refund, (refund) => refund.purchaseReturn)
  refund: Refund[]

}
