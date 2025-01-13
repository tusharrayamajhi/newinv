import { Column, Entity, OneToMany, OneToOne} from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";
import { salesStatus } from "src/utils/enums/salesStatus.enums";
import { SalesReturnItem } from "./salesReturnItem.entities";
import { SalesDetails } from "./SalesDetails.entities";
import { Refund } from "./Refund.entities";


@Entity()
export class SalesReturnDetails extends BaseEntities {

  @Column({
    type: 'enum',
    enum: salesStatus, 
    default: salesStatus.pending,
  })
  sales_return_status: salesStatus;

  @Column({ type: 'datetime' })
  return_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  additional_expenses: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discounts: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_adjusted_refund: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @OneToMany(() => SalesReturnItem, (salesReturnItem) => salesReturnItem.salesReturnDetails) 
  returnItem: SalesReturnItem[];

  @OneToOne(() => SalesDetails, (salesDetails) => salesDetails.sales_return_details) 
  salesDetails: SalesDetails;

  @OneToMany(() => Refund, (refund) => refund.salesReturn) 
  refund: Refund[];
}