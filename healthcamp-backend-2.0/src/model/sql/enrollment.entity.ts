import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { parentEntity } from '.';
import { clientEntity } from './client.entity';
import { packageEntity } from './package.entity';
import { paymentEntity } from './payment.entity';
import { enrollStatus } from 'src/helper/types/index.type';
import { bookingEntity } from './booking.entity';
import { ForwardReportEntity } from './forwardReport.entity';
import { eventCalendarEntity } from './eventCalendar.entity';

@Entity('enrollment')
export class enrollEntity extends parentEntity {

  @Column({ default: 0 })
  participant: number;

  @Column({ default: null })
  status: enrollStatus;

  @Column({ default: null })
  comment: string;

  @ManyToOne(() => clientEntity, (client) => client.enroll,{onDelete:'CASCADE'})
  client: clientEntity;

  @ManyToOne(() => packageEntity, (client) => client.enroll)
  package: packageEntity;

  @OneToOne(() => paymentEntity, (payment) => payment.enroll)
  payment: paymentEntity;

  @OneToMany(() => eventCalendarEntity, (calender) => calender.enrollment)
  eventCalender: eventCalendarEntity[];

  @OneToMany(()=>bookingEntity,book=>book.enrollPackage)
  booking:bookingEntity[];

  @OneToMany(()=>ForwardReportEntity,report=>report.enrollment)
  forwardReport:ForwardReportEntity[];
}
