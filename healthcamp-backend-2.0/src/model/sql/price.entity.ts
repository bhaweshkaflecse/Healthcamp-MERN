// Package price

import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { serviceEntity } from "./service.entity";
import { packageEntity } from "./package.entity";
import { clientEntity } from "./client.entity";
import { purchasePackageEntity } from "./purchasePackage.entity";

@Entity('price')
export class priceEntity extends parentEntity {
    @Column({ nullable: false, default: 0 })
    min: number

    @Column({ nullable: false, default: 0 })
    max: number

    @Column({ nullable: false, default: 0 })
    price: number

    @ManyToOne(() => packageEntity, (e) => e.price, { onDelete: 'CASCADE' })
    package: packageEntity

    @OneToMany(() => purchasePackageEntity, (client) => client.price, { onDelete: 'CASCADE' })
    clientPackage: purchasePackageEntity[];
}
 