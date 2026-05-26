import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { parentEntity } from '.';
import { deptType } from 'src/helper/types/index.type';
import { teamEntity } from './team.entity';
import { subTeamEntity } from './subTeam.entity';
import { clientEntity } from './client.entity';
import { paymentEntity } from './payment.entity';

@Entity('admin')
export class adminEntity extends parentEntity {
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

  @Column({ type: 'enum', enum: deptType })
  department: deptType;

  @ManyToMany((type) => teamEntity, (e) => e.admin)
  team: teamEntity[]

  @ManyToMany((type) => subTeamEntity, (e) => e.admin)
  subTeam: subTeamEntity[]
  
  @OneToOne(() => teamEntity, team => team.teamLeader)
  leadTeam: teamEntity;

  @OneToMany(()=>clientEntity,(client)=>client.teamLead)
  client:clientEntity[];

  @OneToMany(()=>paymentEntity,(ep)=>ep.paymentVerifyBy)
  enrollPackage:parentEntity[];
}
