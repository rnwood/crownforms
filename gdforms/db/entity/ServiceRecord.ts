import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index} from "typeorm";
import {FormRecord} from "."

@Entity("service")
export class ServiceRecord {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    @Index({unique: true})
    url!: string;

    @ManyToOne(() => FormRecord, form => form.services, {nullable: false, eager: true})
    form!: FormRecord|undefined
}
