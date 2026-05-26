import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { ReportEntity } from "./report.entity";
import { AttributeEntity } from "./attribute.entity";
import { participantEntity } from "./participant.entity";

@Entity('result')
export class ResultEntity extends parentEntity {
    @Column({default:null})
    value: string;

    @ManyToOne(() => ReportEntity, (report) => report.results)
    report: ReportEntity;

    @ManyToOne(() => AttributeEntity, (attribute) => attribute.results)
    attribute: AttributeEntity;

    @ManyToOne(() => participantEntity, (participant) => participant.results)
    // @JoinColumn({name:'participantId'})
    participant: participantEntity;
}