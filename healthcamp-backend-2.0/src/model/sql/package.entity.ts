import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { serviceEntity } from "./service.entity";
import { priceEntity } from "./price.entity";
import { clientEntity } from "./client.entity";
import { enrollEntity } from "./enrollment.entity";

@Entity('package')
export class packageEntity extends parentEntity {
    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    description: string

    @Column({ nullable: true, default: null })
    img: string

    @ManyToMany((type) => serviceEntity, (e) => e.package, { onDelete: 'CASCADE' })
    @JoinTable({ name: "package_service" })
    service: serviceEntity[]

    @OneToMany(() => priceEntity, (e) => e.package, { onDelete: 'CASCADE' })
    price: priceEntity[]

    @OneToMany(() => enrollEntity, (enroll) => enroll.package)
    enroll: enrollEntity[]
}

