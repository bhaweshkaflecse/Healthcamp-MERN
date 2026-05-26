import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, OneToOne, JoinColumn } from 'typeorm';
import { parentEntity } from '.';
import { serviceEntity } from './service.entity';
import { dateSlotEntity } from './dateSlot.entity';
import { bookingEntity } from './booking.entity';

@Entity("service_calender")
export class calenderEntity extends parentEntity {
    @OneToOne(() => serviceEntity, service => service.calender)
    @JoinColumn({ name: 'serviceId' })
    service: serviceEntity;

    @OneToMany(() => dateSlotEntity, dateSlot => dateSlot.calendar)
    dateSlots: dateSlotEntity[];

    @OneToMany(() => bookingEntity, (attr) => attr.serviceCalendar)
    booking: bookingEntity[];
}