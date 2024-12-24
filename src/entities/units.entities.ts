import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntities } from "./BaseEntities.entities";
import { Users } from './user.entities';
import { Product } from './product.entities';

@Entity()
export class Units extends BaseEntities {

    @Column({ nullable: false, unique: true })
    name: string

    @Column({ nullable: false, unique: true })
    shortName: string

    @ManyToOne(() => Users,(user)=>user.unit)
    createdBy: Users

    @OneToMany(() => Product, (product) => product.unit)
    products: Product[];

    
}