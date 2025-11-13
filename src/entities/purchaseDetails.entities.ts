import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { PurchaseItem } from "./PurchaseItem.entities";
import { Vendor } from "./vendors.entities";
import { Payment } from "./payment.entities";
import { Companies } from "./Company.entities";
import { Users } from "./user.entities";
import { purchaseStatus } from "src/utils/enums/purchaseStatus.enums";
import { PurchaseReturnDetails } from './purchaseReutrnDetails.entities';



@Entity()
export class PurchaseDetails {

  @Column({ primary: true, type: "varchar", nullable: false, unique: true })
  purchaseCode: string
  
  // @Column({
  //   type: 'enum',
  //   enum: purchaseStatus,
  //   default: purchaseStatus.received,
  // })
  // shipment_status: purchaseStatus;
  
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0,unsigned:false })
  TotalPurchaseAmount: number;
  

  @Column({nullable:true,type:"text"})
  remark:string
  
  @OneToMany(() => PurchaseItem, (purchase) => purchase.purchaseDetails,{eager:true})
  purchases: PurchaseItem[]

  @ManyToOne(() => Vendor, (vendor) => vendor.purchaseDetails)
  vendor: Vendor

  @OneToMany(() => Payment, (payment) => payment.purchaseDetails)
  payments: Payment[]

  @ManyToOne(() => Companies, (company) => company.purchaseDetails)
  company: Companies

  @ManyToOne(() => Users, (user) => user.purchaseDetails)
  purchaseBy: Users

  @OneToOne(() => PurchaseReturnDetails,(purchaseReturnDetails)=>purchaseReturnDetails.purchaseDetails)
  purchases_return_details: PurchaseReturnDetails

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: string;
}