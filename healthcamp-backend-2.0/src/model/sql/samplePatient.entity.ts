import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('sample_patient_file')
export class samplePatientFileEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string

    @Column()
    file:string
}