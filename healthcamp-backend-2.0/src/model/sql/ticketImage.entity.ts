import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TicketEntity } from './ticket.entity';

@Entity('ticket_image')
export class TicketImageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @CreateDateColumn()
    createdAt: Date;

    // One Ticket can have multiple images
    @ManyToOne(() => TicketEntity, ticket => ticket.images)
    ticket: TicketEntity;
}