import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { parentEntity } from '.';
import { packageEntity } from './package.entity';
import { AttributeEntity } from './attribute.entity';
import { subTeamEntity } from './subTeam.entity';
import { calenderEntity } from './serviceCalender.entity';
import { eventCalendarEntity } from './eventCalendar.entity';
import { ReportEntity } from './report.entity';

@Entity('service')
export class serviceEntity extends parentEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @ManyToMany((type) => packageEntity, (e) => e.service, {
    onDelete: 'CASCADE',
  })
  package: packageEntity[];

  @OneToMany(() => AttributeEntity, (attribute) => attribute.services, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  attributes: AttributeEntity[];

  @OneToMany(() => calenderEntity, (key) => key.service)
  calender: calenderEntity;

  @OneToMany(
    () => eventCalendarEntity,
    (eventCalendar) => eventCalendar.service,
  )
  eventCalendar: eventCalendarEntity[];

  @OneToMany(() => subTeamEntity, (item) => item.service)
  subTeam: subTeamEntity[];

  @OneToMany(() => ReportEntity, (result) => result.service)
  report: ReportEntity[];
}
