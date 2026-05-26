import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { parentEntity } from '.';
import { calenderEntity } from './serviceCalender.entity';

@Entity("dateSlot")
export class dateSlotEntity extends parentEntity {
    @ManyToOne(() => calenderEntity, (calendar) => calendar.dateSlots, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    calendar: calenderEntity;

    @Column({nullable:false})
    date: Date;

    @Column({ default: false })
    isDisabled: boolean;

    @Column({default: 1})
    slot: number
}
