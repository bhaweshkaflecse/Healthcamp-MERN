import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { parentEntity } from '.';
import { serviceEntity } from './service.entity';
import { clientEntity } from './client.entity';
import { bookingEntity } from './booking.entity';
import { enrollEntity } from './enrollment.entity';

@Entity('event_calendar')
export class eventCalendarEntity extends parentEntity {
  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: false })
  isDisable: boolean;

  @Column({ type: 'int' })
  slot: number;

  @ManyToOne(() => enrollEntity, (enroll) => enroll.eventCalender)
  @JoinColumn({ name: 'enrollId' })
  enrollment: enrollEntity;

  @ManyToOne(() => serviceEntity, (service) => service.eventCalendar)
  service: serviceEntity;

  @ManyToOne(() => clientEntity, (attr) => attr.eventCalendar, {
    onDelete: 'CASCADE',
  })
  client: clientEntity;

  @OneToMany(() => bookingEntity, (book) => book.eventCalender)
  booking: bookingEntity[];
}
