import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketEntity } from 'src/model/sql/ticket.entity';
import { TicketImageEntity } from 'src/model/sql/ticketImage.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,

    @InjectRepository(TicketImageEntity)
    private readonly ticketImageRepository: Repository<TicketImageEntity>,
  ) {}

  async create(
    createTicketDto: CreateTicketDto,
    imageUrls: string[],
  ): Promise<TicketEntity> {
    const ticket = this.ticketRepository.create(createTicketDto);
    await this.ticketRepository.save(ticket);

    if (imageUrls.length > 0) {
      const ticketImages = imageUrls.map((url) =>
        this.ticketImageRepository.create({ url, ticket }),
      );
      await this.ticketImageRepository.save(ticketImages);
    }

    return ticket;
  }

  async update(
    id: string,
    updateTicketDto: UpdateTicketDto,
  ): Promise<TicketEntity> {
    await this.ticketRepository.update(id, updateTicketDto);
    return this.ticketRepository.findOne({ where: { id } });
  }

  async deleteImage(id: string): Promise<boolean> {
    await this.ticketImageRepository.delete(id);
    return true;
  }

  async addImage(imgURLs: string[], id: string): Promise<any> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (!imgURLs.length)
      throw new BadRequestException('There should be atleast a image.');
    const ticketImages = imgURLs.map((url) =>
      this.ticketImageRepository.create({ url, ticket }),
    );
    return await this.ticketImageRepository.save(ticketImages);
  }

  async softDelete(id: string): Promise<boolean> {
    await this.ticketRepository.softDelete(id);
    return true;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [tickets, total] = await this.ticketRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['images'],
    });
    return { tickets, total, page, pageSize };
  }

  async findOne(id: string): Promise<TicketEntity> {
    return this.ticketRepository.findOne({
      where: { id },
      relations: ['images'],
    });
  }
}
