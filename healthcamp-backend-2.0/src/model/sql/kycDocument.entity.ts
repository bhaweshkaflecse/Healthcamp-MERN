import { Column, Entity, ManyToOne } from "typeorm";
import { kycEntity } from "./kyc.entity";
import { parentEntity } from ".";

@Entity('kycDocuments')
export class kycDocumentEntity extends parentEntity{
    @Column()
    document:string;

    @ManyToOne(()=>kycEntity,(kyc)=>kyc.kycDocument)
    kyc:kycEntity;
}