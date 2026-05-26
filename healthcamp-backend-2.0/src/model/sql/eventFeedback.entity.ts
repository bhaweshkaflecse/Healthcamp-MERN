import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { eventEntity } from "./event.entity";


@Entity('eventFeedback')
export class eventFeedbackEntity extends parentEntity {

    @Column()
    rating:number;

    @Column()
    feedback:string;

    @ManyToOne(()=>eventEntity,(event)=>event.eventFeedback)
    event:eventEntity
}


