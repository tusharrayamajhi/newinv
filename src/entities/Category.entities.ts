import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";
import { Users } from "./user.entities";
import { Product } from "./product.entities";
import { Companies } from "./Company.entities";

@Entity()
export class Category extends BaseEntities{
    @Column({nullable:false})
    name:string

    @Column({nullable:true,type:"text"})
    description:string

    @ManyToOne(()=>Users,(user)=>user.category)
    createdBy:Users

    @OneToMany(()=>Product,(product)=>product.category)
    product:Product[]

    @ManyToOne(()=>Companies,(company)=>company.category)
    company:Companies
}