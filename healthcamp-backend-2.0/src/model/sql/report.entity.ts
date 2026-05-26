import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { parentEntity } from '.';
import { eventEntity } from './event.entity';
import { ResultEntity } from './result.entity';
import { serviceEntity } from './service.entity';
import { participantEntity } from './participant.entity';
import { trackParticipantReportEntity } from './trackReport.entity';

@Entity('report')
export class ReportEntity extends parentEntity {

    @OneToOne(() => eventEntity, (event) => event.report)
    @JoinColumn({name:"eventId"})
    event: eventEntity;

    @OneToMany(() => ResultEntity, (result) => result.report)
    results: ResultEntity[];

    @ManyToOne(() => serviceEntity, (event) => event.report)
    service: serviceEntity;

    @OneToMany(()=>trackParticipantReportEntity,trackReport=>trackReport.report)
    trackReport:trackParticipantReportEntity[];
}