import { paymentEnum } from "src/utils/enums/payment.enums";
import { Column, Entity, ManyToOne } from "typeorm";
import { Customer } from "./customers.entities";
import { Vendor } from "./vendors.entities";
import { Companies } from "./Company.entities";
import { BaseEntities } from "./BaseEntities.entities";
import { PurchaseReturnDetails } from "./purchaseReutrnDetails.entities";
import { SalesReturnDetails } from "./salesReturnDetails.entities";

@Entity()
export class Refund extends BaseEntities {
    @Column({
        type: 'enum',
        enum: paymentEnum,
        default: paymentEnum.cash,
    })
    refund_method: paymentEnum;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    refund_amount: number;

    @ManyToOne(() => Customer, (customer) => customer.refund, { nullable: true })
    customer: Customer;

    @ManyToOne(() => Vendor, (vendor) => vendor.refund, { nullable: true })
    vendor: Vendor;

    @Column({ nullable: true, type: "text" })
    remark: string

    @ManyToOne(() => Companies, (company) => company.refund)
    company: Companies

    @ManyToOne(() => PurchaseReturnDetails, (purchaseReturn) => purchaseReturn.refund)
    purchaseReturn: PurchaseReturnDetails

    @ManyToOne(() => SalesReturnDetails, (salesReturn) => salesReturn.refund)
    salesReturn: SalesReturnDetails

}