import { Column, Entity } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";


@Entity()
export class Notification extends BaseEntities{

    @Column({type:"text",nullable:false})
    message:string


}