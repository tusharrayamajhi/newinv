import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { salesItem } from "./salesItem.entities";
import { Payment } from "./payment.entities";
import { Customer } from "./customers.entities";
import { Users } from "./user.entities";
import { Companies } from "./Company.entities";
import { salesStatus } from "src/utils/enums/salesStatus.enums";
import { SalesReturnDetails } from "./salesReturnDetails.entities";

@Entity()
export class SalesDetails {


    @Column({ primary: true, type: 'varchar', length: 100, nullable: false, unique: true })
    sales_code: string;

    @ManyToOne(() => Customer, (customer) => customer.salesDetails)
    customer: Customer

    @Column({
        type: 'enum',
        enum: salesStatus,
        default: salesStatus.sent,
    })
    shipment_status: salesStatus;

    @Column({ type: 'decimal', precision: 20, scale: 5, default: 0.0 })
    total_before_discount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    discount: number;

    @Column({ type: 'decimal', precision: 20, scale: 5, default: 0.0, })
    total_after_dis: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    tax_rate: number;

    @Column({ type: 'decimal', precision: 20, scale: 5, default: 0.0, })
    total_after_tax: number;

    @OneToMany(() => salesItem, (sale) => sale.SalesDetails)
    sales_item: salesItem[]

    @OneToMany(() => Payment, (payment) => payment.SalesDetails)
    payments: Payment[]

    // @OneToMany(() => salesItem, (sale) => sale.SalesDetails)
    // return_item: []
    
    @ManyToOne(() => Companies, (company) => company.salesDetails)
    company: Companies

    @ManyToOne(() => Users, (customer) => customer.salesDetails)
    salesBy: Users

    @Column({ type: 'text', nullable: true })
    remarks: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: string;

    @OneToOne(()=>SalesReturnDetails)
    sales_return_details:SalesReturnDetails
    
    // @DeleteDateColumn({ type: 'timestamp', nullable: true })
    // deletedAt: string;
}