import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { eventStatus, reportForwardBy, reportPublishType } from "src/helper/types/index.type";
import { bookingDateEntity } from "./booking_date.entity";
import { eventSubteamEntity } from "./eventSubteam.entity";
import { eventFeedbackEntity } from "./eventFeedback.entity";
import { participantEntity } from "./participant.entity";
import { ReportEntity } from "./report.entity";


@Entity('event')
export class eventEntity extends parentEntity {
   
    @Column({default:null})
    participant: number;

    @Column()
    status: eventStatus

     @Column({ default: null, nullable: true })
    reportForwardBy: reportForwardBy;

    @Column({default:reportPublishType.created})
    reportPublishType:reportPublishType

    @OneToOne(() => bookingDateEntity, (booking) => booking.event)
    @JoinColumn({ name: 'bookingDateId' })
    bookingDate: bookingDateEntity

    @OneToMany(() => eventSubteamEntity, (subteamEvent) => subteamEvent.event)
    subteam: eventSubteamEntity[];

    @OneToMany(() => eventFeedbackEntity, (ef) => ef.event)
    eventFeedback: eventFeedbackEntity[];

    @ManyToMany(() => participantEntity, (participant) => participant.events)
    @JoinTable({ name: 'event_participant' })
    participants: participantEntity[];

    @OneToOne(() => ReportEntity, (report) => report.event)
    report: ReportEntity;
}