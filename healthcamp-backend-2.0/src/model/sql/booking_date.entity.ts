import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { bookingEntity } from "./booking.entity";
import { eventEntity } from "./event.entity";

@Entity('booking_date')
export class bookingDateEntity extends parentEntity {
    @ManyToOne(() => bookingEntity, (booking) => booking.bookingDates, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bookingId' })
    booking: bookingEntity;
    
    @Column({ type: 'date', nullable: false })
    date: Date;

    @OneToOne(() => eventEntity, (event) => event.bookingDate)
    event: eventEntity;
}