import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { enrollEntity } from "./enrollment.entity";
import { reportForwardStatus } from "src/helper/types/index.type";
import { participantEntity } from "./participant.entity";


@Entity('forwardedReport')
export class ForwardReportEntity extends parentEntity{
    @Column()
    isForward:reportForwardStatus;

    @ManyToOne(()=>enrollEntity,(enroll)=>enroll.forwardReport)
    enrollment:enrollEntity;
 
    @ManyToOne(()=>participantEntity,(participant)=>participant.forwardReport)
    participant:participantEntity;
    
}