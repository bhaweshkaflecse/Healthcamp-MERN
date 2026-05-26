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
import { subTeamEntity } from './subTeam.entity';

@Entity('custom')
export class customEntity extends parentEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'bigint', unique: true })
  contact: number;

  @Column()
  address: string;

  @Column({ default: null, nullable: true })
  profile: string;

  @Column({ default: null, nullable: true })
  designation: string;

  @ManyToMany((type) => subTeamEntity, (e) => e.custom, {onDelete:"CASCADE"})
  subTeam: subTeamEntity[];
}
