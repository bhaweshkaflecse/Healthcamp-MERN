import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { packageEntity } from './package.entity';
import { kycEntity } from './kyc.entity';
import { purchasePackageEntity } from './purchasePackage.entity';
import { participantEntity } from './participant.entity';
import { adminEntity } from './admin.entity';
import { enrollEntity } from './enrollment.entity';
import { eventCalendarEntity } from './eventCalendar.entity';
import { bookingEntity } from './booking.entity';

@Entity('client')
export class clientEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'bigint', unique: true })
  contact: number;

  @Column()
  address: string;

  @Column({ default: null })
  profile: string;

  @Column()
  primaryLevelParticipant: number;

  @Column()
  midLevelParticipant: number;

  @Column()
  higherLevelParticipant: number;

  @OneToOne(() => kycEntity, (kyc) => kyc.client)
  kyc: kycEntity;

  @OneToMany(() => purchasePackageEntity, (pkg) => pkg.client)
  package: purchasePackageEntity[];

  @OneToMany(() => participantEntity, participant => participant.client)
  participant: participantEntity[];

  @ManyToOne(() => adminEntity, (team) => team.client, { cascade: true })
  teamLead: adminEntity;

  @OneToMany(() => bookingEntity, attr => attr.client)
  booking: bookingEntity[];

  @OneToMany(() => eventCalendarEntity, eventCalendar => eventCalendar.client)
  eventCalendar: eventCalendarEntity[];

  @OneToMany(() => enrollEntity, (enroll) => enroll.client)
  enroll: enrollEntity[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date; 
}
