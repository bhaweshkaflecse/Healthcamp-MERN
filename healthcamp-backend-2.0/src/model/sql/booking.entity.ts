import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { bookingStatus } from "src/helper/types/index.type";
import { calenderEntity } from "./serviceCalender.entity";
import { clientEntity } from "./client.entity";
import { bookingDateEntity } from "./booking_date.entity";
import { eventCalendarEntity } from "./eventCalendar.entity";
import { enrollEntity } from "./enrollment.entity";

@Entity('booking')
export class bookingEntity extends parentEntity {
    @Column({ default: bookingStatus.hold })
    status: bookingStatus;

    @Column()
    venue: string;

    @ManyToOne(() => clientEntity, (client) => client.booking,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'clientId' })
    client: clientEntity;
 
    @ManyToOne(() => calenderEntity, (calendar) => calendar.booking)
    @JoinColumn({ name: 'serviceCalendarId' })
    serviceCalendar: calenderEntity;

    @Column({ default:null, nullable:true })
    comment:string;

    @OneToMany(() => bookingDateEntity, (bookingDate) => bookingDate.booking, { cascade: true,onDelete:'CASCADE' })
    bookingDates: bookingDateEntity[];

    @ManyToOne(()=>eventCalendarEntity,booking=>booking.booking)
    @JoinColumn({name:'eventCalenderId'})
    eventCalender:eventCalendarEntity;

    @ManyToOne(()=>enrollEntity,enroll=>enroll.booking)
    enrollPackage:enrollEntity;
}