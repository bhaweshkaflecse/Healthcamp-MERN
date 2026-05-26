import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { serviceEntity } from "./service.entity";
import { ResultEntity } from "./result.entity";

@Entity('attribute')
export class AttributeEntity extends parentEntity {
  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => serviceEntity, (service) => service.attributes,{onDelete:'CASCADE'})
  services: serviceEntity;

  @OneToMany(() => ResultEntity, (result) => result.attribute)
  results: ResultEntity[];
}