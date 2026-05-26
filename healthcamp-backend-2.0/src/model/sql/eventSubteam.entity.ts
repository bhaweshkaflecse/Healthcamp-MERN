import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { eventStatus } from "src/helper/types/index.type";
import { subTeamEntity } from "./subTeam.entity";
import { bookingEntity } from "./booking.entity";
import { bookingDateEntity } from "./booking_date.entity";
import { eventEntity } from "./event.entity";


@Entity('eventSubteam')
export class eventSubteamEntity extends parentEntity {

    @ManyToOne(() => subTeamEntity, (subteam) => subteam.event)
    subTeam: subTeamEntity;

    @ManyToOne(()=>eventEntity,(event)=>event.subteam)
    event:eventEntity
}


