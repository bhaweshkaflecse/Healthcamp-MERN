import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from 'src/model/sql/ticket.entity';
import { TicketImageEntity } from 'src/model/sql/ticketImage.entity';
import { UploadService } from 'src/helper/utils/files_upload';

@Module({
  imports: [TypeOrmModule.forFeature([
    TicketEntity,
    TicketImageEntity,
  ])],
  controllers: [TicketController],
  providers: [TicketService, UploadService],
})
export class TicketModule { }
