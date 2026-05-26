import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from '.';
import { ReportEntity } from './report.entity';
import { participantEntity } from './participant.entity';
import {
  reportForwardStatus,
} from 'src/helper/types/index.type';

@Entity('track_participant_report')
export class trackParticipantReportEntity extends parentEntity {

  @Column({ default: reportForwardStatus.false })
  reportForwardStatus: reportForwardStatus;

  @ManyToOne(() => ReportEntity, (report) => report.trackReport)
  report: ReportEntity;

  @ManyToOne(() => participantEntity, (participant) => participant.trackReport)
  participant: participantEntity;
}
