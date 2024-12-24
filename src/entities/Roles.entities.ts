import { Column, Entity,JoinTable,ManyToMany,ManyToOne,OneToMany } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities"
import { Users } from "./user.entities";
import { Permission } from "./permission.entites";
import { Companies } from "./Company.entities";

@Entity()
export class Roles extends BaseEntities{

    @Column({nullable:false,type:"varchar",length:200})
    name:string

    @Column({nullable:false,type:"text"})
    description:string 

    @OneToMany(() => Users,(user)=>user.roles)
    user:Users[]

    @ManyToMany(()=>Permission,(permission)=>permission.roles)
    @JoinTable()
    permission:Permission[]

    @ManyToOne(()=>Users,(user)=>user.createdRoles)
    createdBy:Users

    @ManyToOne(()=>Companies,(company)=>company.roles)
    company:Companies
}