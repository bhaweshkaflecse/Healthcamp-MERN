import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { paymentMode, paymentStatus } from "src/helper/types/index.type";
import { enrollEntity } from "./enrollment.entity";
import { adminEntity } from "./admin.entity";

@Entity('payment')
export class paymentEntity extends parentEntity{

    @Column({default:null})
    price:number;

    @Column({default:null})
    medium:paymentMode;

    @Column({default:null})
    proof:string;

    @Column({default:null})
    status:paymentStatus

    @Column({default:null})
    comment:string

    @OneToOne(()=>enrollEntity,(enroll)=>enroll.payment,{onDelete:'CASCADE'})
    @JoinColumn({name:'enrollmentId'})
    enroll:enrollEntity

    @ManyToOne(()=>adminEntity,(finance)=>finance.enrollPackage,{nullable:true})
    paymentVerifyBy:adminEntity
}