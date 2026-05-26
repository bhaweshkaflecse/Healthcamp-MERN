import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { teamEntity } from "./team.entity";
import { adminEntity } from "./admin.entity";
import { serviceEntity } from "./service.entity";
import { customEntity } from "./customMember.entity";
import { eventEntity } from "./event.entity";
import { eventSubteamEntity } from "./eventSubteam.entity";

@Entity('sub_team')
export class subTeamEntity extends parentEntity {
    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    description: string

    @Column({default:false})
    isAssigned:Boolean

    @ManyToOne(()=>teamEntity, (e)=>e.subTeam)
    team: teamEntity

    @ManyToMany((type) => adminEntity, (e) => e.subTeam)
    @JoinTable({ name: "subAdmin_team" })
    admin: adminEntity[]

    @ManyToOne(()=>serviceEntity,(service)=>service.subTeam)
    service:serviceEntity

    @ManyToMany(()=>customEntity,(service)=>service.subTeam)
    @JoinTable({ name: 'custom_subteam' })
    custom:customEntity[]

    @OneToMany(()=>eventSubteamEntity,(event)=>event.subTeam)
    event:eventSubteamEntity[];

}