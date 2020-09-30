import { IFormModelOptions } from "gdforms-components";
import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { ServiceRecord } from ".";

@Entity("form")
export class FormRecord {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column("jsonb")
    definition!: IFormModelOptions;

    @OneToMany(() => ServiceRecord, service => service.form)
    services: ServiceRecord[]|undefined;

}
