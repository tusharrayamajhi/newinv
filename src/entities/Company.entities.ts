import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";
import { Users } from "./user.entities";
import { Roles } from "./Roles.entities";
import { Category } from "./Category.entities";


@Entity()
export class Companies extends BaseEntities{

  @Column({ length: 100 })
  company_name: string;

  @Column({ length: 50, unique: true })
  company_code: string;

  @Column({ length: 100 })
  registration_no: string;

  @Column({ length: 10})
  phone: string;

  @Column({ length: 100,nullable:false,unique:true})
  email: string;

  @Column({ length: 100, unique: true })
  pan_vat_no: string;

  @Column({ length: 100 })
  address: string;

  @Column({ length: 50 })
  country: string;

  @Column({ length: 50, nullable: true })
  state: string;

  @Column({ length: 50, nullable: true })
  city: string;

  @Column('int', { nullable: true })
  zip: number;

  @Column({ length: 100, nullable: true })
  bank_name: string;

  @Column({ length: 100, nullable: true })
  account_no: string;

  @Column({ length: 100, nullable: true })
  bank_branch: string;

  @Column({ length: 100, nullable: true })
  bank_address: string;

  @Column('int', { nullable: true })
  bank_code: number;

  @Column({ length: 100, nullable: true })
  website: string;

  @Column({ length: 200, nullable: true })
  company_logo: string;

  @OneToMany(() => Users, (user) => user.company)
  users: Users[]

  @OneToMany(() => Roles, (roles) => roles.company)
  roles: Roles[]

  @ManyToOne(() => Users, (user) => user.createdCompany)
  createdBy: Users

  @OneToMany(()=>Category,(category)=>category.company)
  category:Category
}
