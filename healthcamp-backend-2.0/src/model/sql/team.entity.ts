import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { adminEntity } from "./admin.entity";
import { subTeamEntity } from "./subTeam.entity";
import { clientEntity } from "./client.entity";

@Entity('team')
export class teamEntity extends parentEntity {
    @Column({ nullable: false, type: 'varchar' })
    name: string

    @Column({ nullable: false })
    description: string

    @OneToOne(() => adminEntity, (admin)=>admin.team, { nullable: true})
    @JoinColumn()
    teamLeader: adminEntity;

    @ManyToMany((type) => adminEntity, (e) => e.team, {
        cascade: true,
    })
    @JoinTable({ name: "admin_team" })
    admin: adminEntity[]

    @OneToMany(() => subTeamEntity, (e) => e.team,{onDelete:'CASCADE'})
    subTeam: subTeamEntity[]

}