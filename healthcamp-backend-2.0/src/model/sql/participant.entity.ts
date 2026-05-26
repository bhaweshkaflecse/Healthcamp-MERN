import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { parentEntity } from ".";
import { clientEntity } from "./client.entity";
import { genderType } from "src/helper/types/index.type";
import { eventEntity } from "./event.entity";
import { ResultEntity } from "./result.entity";
import { ReportEntity } from "./report.entity";
import { trackParticipantReportEntity } from "./trackReport.entity";
import { ForwardReportEntity } from "./forwardReport.entity";

@Entity('participant')
export class participantEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    gender: genderType;

    @Column({ nullable: true, type: 'int' })
    grade: number;

    @Column({ nullable: true })
    address: string;

    @Column({ type: 'bigint', unique: false, nullable: false })
    contact: number;

    @Column({ unique: false, nullable: true, default: null })
    email: string;

    @ManyToOne(() => clientEntity, (client) => client.participant, { onDelete: 'CASCADE' })
    client: clientEntity;

    @ManyToMany(() => eventEntity, (event) => event.participants)
    events: eventEntity[];

    @OneToMany(() => ResultEntity, (result) => result.participant)
    results: ResultEntity[];

    @OneToMany(() => ResultEntity, (report) => report.participant)
    reports: ResultEntity[];

    @OneToMany(() => ForwardReportEntity, (report) => report.participant)
    forwardReport: ForwardReportEntity[];

    @OneToMany(() => trackParticipantReportEntity, (report) => report.participant)
    trackReport: trackParticipantReportEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}