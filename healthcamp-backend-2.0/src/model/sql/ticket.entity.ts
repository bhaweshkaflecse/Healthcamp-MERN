import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TicketImageEntity } from './ticketImage.entity';

@Entity('ticket')
export class TicketEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: true })
    isOpen: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    // One Ticket can have multiple images
    @OneToMany(() => TicketImageEntity, image => image.ticket)
    images: TicketImageEntity[];
}