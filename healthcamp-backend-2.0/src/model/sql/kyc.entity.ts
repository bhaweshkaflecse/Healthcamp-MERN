import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { clientEntity } from "./client.entity";
import { kycStatus } from "src/helper/types/index.type";
import { kycDocumentEntity } from "./kycDocument.entity";

@Entity('kyc')
export class kycEntity extends parentEntity {
    @Column()
    name: string;

    @Column({ default: null })
    province: string;

    @Column({ default: null })
    district: string;

    @Column({ default: null })
    city: string;

    @Column({ default: null })
    streetAddress: string;

    @Column({ type: 'bigint' })
    contact: number;

    @Column()
    email: string;
    
    @Column({ default: null })
    documentType: string

    @Column({ default: null })
    comment: string;

    @Column({ default: null, nullable: true })
    kycStatus: kycStatus;

    @OneToOne(() => clientEntity, client => client.kyc,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'clientId' })
    client: clientEntity;

    @OneToMany(()=>kycDocumentEntity,kycDocument=>kycDocument.kyc)
    kycDocument:kycDocumentEntity[];
}