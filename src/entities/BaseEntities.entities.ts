import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export abstract class BaseEntities {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: string;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: string;

}