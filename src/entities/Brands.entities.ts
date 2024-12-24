import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";
import { Product } from "./product.entities";
import { Users } from "./user.entities";


@Entity()
export class Brands extends BaseEntities {
    @Column({ nullable: false })
    brandName: string

    @Column({ type: "text" })
    description: string

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];

    @ManyToOne(() => Users,(user)=>user.brand)
    createdBy: Users
}