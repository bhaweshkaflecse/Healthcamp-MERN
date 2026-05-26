import { BadRequestException, Inject, Injectable, NotAcceptableException, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateCalenderDto, updateDateSlotDto } from './dto/create-calender.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { serviceEntity } from 'src/model/sql/service.entity';
import { dateSlotEntity as DateSlotEntity } from 'src/model/sql/dateSlot.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { checkIsDateAddedDto, InsertDateSlotdto } from '../_subteam/dto/InsertDateSlot.dto';
import { endOfDay, format, parseISO, startOfDay } from 'date-fns';
import { calenderEntity } from 'src/model/sql/serviceCalender.entity';

@Injectable()
export class CalenderService {
  constructor(
    @InjectRepository(calenderEntity)
    private calenderRepository: Repository<calenderEntity>,

    @InjectRepository(serviceEntity)
    private serviceRepository: Repository<serviceEntity>,

    @InjectRepository(DateSlotEntity)
    private dateSlotRepository: Repository<DateSlotEntity>,

    // @Inject(forwardRef(() => CalenderGateway))
    // private readonly calendarGateway: CalenderGateway, 

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(createCalenderDto: CreateCalenderDto) {
    const existingService = await this.serviceRepository.findOne({ where: { id: createCalenderDto.service } })
    if (!existingService) {
      throw new NotFoundException("Invalid service")
    }
    // console.log("service", existingService);
    const existingCalender = await this.calenderRepository.findOne({ where: { service: { id: createCalenderDto.service } } })
    // console.log("existing", existingCalender);
    if (existingCalender) {
      throw new NotAcceptableException("Calender already exist for this service")
    }
    const calendarEntity = new calenderEntity();
    calendarEntity.service = existingService;
    // await this.calendarGateway.getCalender()
    await this.cacheManager.del("/api/v1/service")
    await this.cacheManager.del(`api/v1/${createCalenderDto.service}`)
    return await this.calenderRepository.save(calendarEntity)
  }

  async findOne(id: string) {
    const calenderToWork = await this.calenderRepository.findOne({ where: { service: { id: id } } });
    return await this.calenderRepository.findOne({
      where: { id: calenderToWork.id }, relations: ["dateSlots", "service"],
    })
  }

  async InsertDateSlot(body: InsertDateSlotdto) {
    const existingCalender = await this.calenderRepository.findOne({ where: { id: body.calender } })
    // console.log(existingCalender);
    if (!existingCalender) {
      throw new NotFoundException("Invalid service")
    }
    const inputDate = format(parseISO(body.date.toISOString()), 'yyyy-MM-dd');
    // const isDateAdded = await this.dateSlotRepository.findOne({ where: { date: new Date(inputDate), calendar: { id: existingCalender.id } } });
    // if (isDateAdded) {
      // console.log(isDateAdded);
    //   throw new NotAcceptableException("This date is already added.")
    // }
    const dateSlotEntity = new DateSlotEntity()
    dateSlotEntity.calendar = existingCalender
    dateSlotEntity.date = new Date(inputDate)
    dateSlotEntity.isDisabled = body.isDisabled
    dateSlotEntity.slot = body.slot
    return this.dateSlotRepository.save(dateSlotEntity)
  }

  async getAll() {
    return await this.calenderRepository.find({
      relations: ["dateSlots", "dateSlots.slots", "service"],
    })
  }

  async isDateAdded(query: checkIsDateAddedDto): Promise<boolean> {
    const inputDate = parseISO(query.date.toISOString());
    const start = startOfDay(inputDate);
    const end = endOfDay(inputDate);

    const isDateAdded = await this.dateSlotRepository.findOne({
      where: {
        date: Between(start, end),
        calendar: { id: query.calendar },
      },
    });

    return !!isDateAdded;
  }

  async updateDateSlot(id, body: updateDateSlotDto) {
    // console.log(id, body);
    const existingSlots = await this.dateSlotRepository.findOne({ where: { id } })
    if (!existingSlots) {
      throw new NotAcceptableException("Invalid dateslot.")
    }
    existingSlots.isDisabled = body.isDisabled;
    existingSlots.slot = body.slot;
    const updatedPackage = await this.dateSlotRepository.save(existingSlots);
    return updatedPackage

  }
}
