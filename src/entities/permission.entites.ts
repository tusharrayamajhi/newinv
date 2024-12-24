
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntities } from './BaseEntities.entities';

import { Users } from './user.entities';
import { Roles } from './Roles.entities';

@Entity()
export class Permission extends BaseEntities {

    @Column({ nullable: false, length: 100, type: 'varchar' })
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => Roles,(role)=>role.permission, { nullable: false })
    roles: Roles[];

    @ManyToOne(() => Users,(user)=>user.id, { nullable: false })
    createdBy: Users; 
}
