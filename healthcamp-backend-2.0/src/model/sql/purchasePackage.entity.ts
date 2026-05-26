
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { paymentMode, paymentStatus } from "src/helper/types/index.type";
import { priceEntity } from "./price.entity";
import { clientEntity } from "./client.entity";

@Entity('purchased_package')
export class purchasePackageEntity extends parentEntity {

    @Column()
    amount: number;

    @Column()
    paymentMode: paymentMode;

    @Column({ default: paymentStatus.pending })
    paymentStatus: paymentStatus;

    @Column()
    paymentProof: string;

    @ManyToOne(() => clientEntity, (client) => client.package,{onDelete:'CASCADE'})
    client: clientEntity;

    @ManyToOne(() => priceEntity, (price) => price.clientPackage, { onDelete: "CASCADE" })
    price: priceEntity;
}
