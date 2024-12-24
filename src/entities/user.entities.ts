import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";
import { Companies } from "./Company.entities";
import { Roles } from "./Roles.entities";
import { Category } from "./Category.entities";
import { Units } from "./units.entities";
import { Brands } from "./Brands.entities";
import { Product } from "./product.entities";
import { Vendor } from "./vendors.entities";
import { Customer } from "./customers.entities";
import { Purchase } from "./Purchase.entities";
import { Invoices } from "./invoice.entities";
import { InvoiceReturn } from "./InvoiceReturn.entities";

@Entity()
export class Users extends BaseEntities {

    @Column({ length: 100, nullable: false, type: "varchar" })
    first_name: string;

    @Column({ length: 100, nullable: true, type: "varchar" })
    middle_name: string;

    @Column({ length: 100, nullable: false, type: "varchar" })
    last_name: string;

    @Column({ length: 100, nullable: true, type: "varchar" })
    address: string;

    @Column({ length: 15, nullable: true, type: "varchar" })
    phone: string; 

    @Column({ length: 100, unique: true, nullable: false, type: "varchar" })
    email: string;

    @Column({ type: "varchar", length: 255, nullable: false }) 
    password: string;

    @Column({ default: 0, nullable: false, type: "tinyint" })
    is_active: number;

    @Column({ length: 300, nullable: true, type: "varchar" })
    user_image: string;

    //relationship
    @ManyToOne(() => Companies, (company) => company.users)
    company: Companies
    
    @OneToMany(() => Companies,(company)=>company.createdBy)
    createdCompany: Companies[];

    @ManyToOne(() => Roles, (roles) => roles.user)
    roles: Roles

    @OneToMany(() => Roles,(roles)=>roles.createdBy)
    createdRoles: Roles[];

    @OneToMany(() => Category,(category)=>category.createdBy)
    category: Category[]

    @OneToMany(() => Units,(unit)=>unit.createdBy)
    unit: Units[]

    @OneToMany(() => Brands,(brand)=>brand.createdBy)
    brand: Brands[]

    @OneToMany(() => Product,(product)=>product.createdBy)
    product: Product[]

    @OneToMany(() => Vendor, (vendor) => vendor.createdBy)
    vendor: Vendor

    @OneToMany(() => Customer, (customer) => customer.createdBy)
    customer: Customer[]

    @OneToMany(() => Purchase, (purchase) => purchase.purchasedBy)
    purchase: Purchase[]

    @OneToMany(() => Invoices, (invoice) => invoice.createdBy)
    invoice: Invoices[]

    @OneToMany(() => InvoiceReturn, (invoiceReturn) => invoiceReturn.processBy)
    salesReturn: InvoiceReturn[]

    @OneToMany(() => Users,(user)=>user.createdBy)
    createdUser: Users[];

    @OneToMany(() => Users,(user)=>user.createdUser)
    createdBy: Users

}