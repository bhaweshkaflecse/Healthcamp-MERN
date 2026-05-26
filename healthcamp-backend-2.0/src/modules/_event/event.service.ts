import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  AssignSubteamDto,
  CreateEventDto,
  EventFeedbackDto,
} from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { eventEntity } from 'src/model/sql/event.entity';
import {
  Between,
  DataSource,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import {
  bookingStatus,
  eventStatus,
  reportPublishType,
} from 'src/helper/types/index.type';
import { bookingDateEntity } from 'src/model/sql/booking_date.entity';
import { eventSubteamEntity } from 'src/model/sql/eventSubteam.entity';
import { bookingEntity } from 'src/model/sql/booking.entity';
import { subTeamEntity } from 'src/model/sql/subTeam.entity';
import { eventFeedbackEntity } from 'src/model/sql/eventFeedback.entity';
import { eventCalendarEntity } from 'src/model/sql/eventCalendar.entity';
import { format, parseISO } from 'date-fns';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { ReportEntity } from 'src/model/sql/report.entity';
import { serviceEntity } from 'src/model/sql/service.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(eventEntity)
    private eventRepository: Repository<eventEntity>,

    @InjectRepository(eventCalendarEntity)
    private eventCalendarRepository: Repository<eventCalendarEntity>,

    @InjectRepository(eventSubteamEntity)
    private eventSubteamRepository: Repository<eventSubteamEntity>,

    @InjectRepository(eventFeedbackEntity)
    private eventFeedRepository: Repository<eventFeedbackEntity>,

    @InjectRepository(bookingEntity)
    private bookingRepository: Repository<bookingEntity>,

    @InjectRepository(bookingDateEntity)
    private bookingDateRepository: Repository<bookingDateEntity>,

    @InjectRepository(subTeamEntity)
    private subTeamRepository: Repository<subTeamEntity>,

    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,


    private dataSource: DataSource,
  ) {}
  async eventFeedback(id: string, eventFeedbackDto: EventFeedbackDto) {
    const eventFeedback = this.eventFeedRepository.create({
      ...eventFeedbackDto,
      event: { id },
    });
    await this.eventFeedRepository.save(eventFeedback);
    return true;
  }

  async assignSubteam(id: string, assignSubteam: AssignSubteamDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // const Client = new clientEntity({...createClientDto});

      const newEvent = new eventEntity();
      newEvent.bookingDate = { id } as bookingDateEntity;
      newEvent.status = eventStatus.pending;
      newEvent.participant = assignSubteam.participant;

      await queryRunner.manager.save(newEvent);

      const events = await Promise.all(
        assignSubteam.subteams.map(async (subteam) => {
        const assigned= await this.isSubteamAssignDate(id,subteam);
        // console.log('subteam and assigned status:',assigned,subteam);
        if(assigned){
          throw new ForbiddenException('subTeam assigned to another event for this date.');
        }
          const event = new eventSubteamEntity();
          event.event = newEvent;
          event.subTeam = { id: subteam } as subTeamEntity;
          return event;
        }),
      );

      await queryRunner.manager.save(events);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      // console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException(error.errorResponse);
    } finally {
      await queryRunner.release();
    }
  }

  async subTeamAssign(bookDateId: string, subTeamId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const client = new eventEntity();
      client.bookingDate = { id: bookDateId } as bookingDateEntity;
      client.status = eventStatus.pending;
      await queryRunner.manager.save(client);

      const event = new eventSubteamEntity();
      event.event = client;
      event.subTeam = { id: subTeamId } as subTeamEntity;

      await queryRunner.manager.save(event);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      // console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException(error.errorResponse);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all event`;
  }

  async findEventService(id: string) {
    const event = await this.eventCalendarRepository.find({
      where: {
        isDisable: false,
        service: { id },
      },
      relations: ['booking.client', 'booking.bookingDates'],
      select: {
        id: true,
        booking: {
          id: true,
          client: {
            id: true,
            name: true,
          },
          bookingDates: {
            id: true,
            date: true,
          },
        },
      },
    });
    return event;
  }

  async findEventParticipant(id: string, subTeamId: string) {
    // console.log(id, subTeamId);
    const event = await this.eventRepository.findOne({
      where: {
        subteam: {
          id,
          subTeam: { id: subTeamId },
        },
      },
      relations: ['bookingDate.booking'],
      select: {
        id: true,
        participant: true,
        bookingDate: {
          id: true,
          booking: {
            id: true,
          },
        },
      },
    });
    const booking = await this.bookingRepository.findOne({
      where: { id: event.bookingDate.booking.id },
      relations: ['bookingDates.event.subteam'],
      select: {
        id: true,
        bookingDates: {
          id: true,
          event: {
            id: true,
            participant: true,
          },
        },
      },
    });

    // console.log(booking);

    let totalEnrolledParticipant = 0;
    booking.bookingDates.forEach((booking) => {
      if (booking.event) {
        totalEnrolledParticipant += booking?.event?.participant;
      }
    });
    return event;
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['subteam.subTeam.admin', 'bookingDate'],
      select: {
        id: true,
        status: true,
        bookingDate: {
          id: true,
          date: true,
        },
        subteam: {
          id: true,
          subTeam: {
            id: true,
            name: true,
            admin: {
              id: true,
              name: true,
              profile: true,
              department: true,
            },
          },
        },
      },
    });
    return event;
  }

  findByStatus() {}

  async findSubteam(id: string) {
    const subteam = await this.eventRepository.findOne({
      where: { bookingDate: { id } },
      relations: [
        'bookingDate.booking.client',
        'bookingDate.booking.serviceCalendar.service',
        'subteam.subTeam',
      ],
      select: {
        id: true,
        bookingDate: {
          id: true,
          date: true,
          booking: {
            id: true,
            venue: true,
            client: {
              id: true,
              name: true,
            },
            serviceCalendar: {
              id: true,
              service: {
                id: true,
                name: true,
              },
            },
          },
        },
        subteam: {
          id: true,
          subTeam: {
            id: true,
            name: true,
          },
        },
      },
    });
    return subteam;
  }

  async upcomingEvent(id: string) {
    const events = await this.eventRepository.find({
      where: {
        bookingDate: {
          date: MoreThan(new Date()),
          booking: { client: { teamLead: { leadTeam: { admin: { id } } } } },
        },
        // subteam: { subTeam: { team: { admin: { id } } } },
        // subTeam:{team:{admin:{id}}}
      },
      relations: ['bookingDate.booking.serviceCalendar.service'],
      select: {
        id: true,
        bookingDate: {
          id: true,
          date: true,
          booking: {
            id: true,
            venue: true,
            serviceCalendar: {
              id: true,
              service: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    return events;
  }

  async completedEvent(id: string) {
    const events = await this.eventRepository.find({
      where: {
        status: eventStatus.completed,
        bookingDate: {
          // date: LessThan(new Date()),
          booking: { client: { teamLead: { leadTeam: { admin: { id } } } } },
        },
      },
      // relations:['booking','booking.booking.client.teamLead.leadTeam.admin']
    });
    return events;
  }

  async findCompleted(page: number, perPage: number) {
    const [events, total] = await this.eventRepository.findAndCount({
      where: {
        status: eventStatus.completed,
        // date:LessThan(new Date())
      },
      select: ['id'],
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return {
      events,
      total,
      page,
      perPage,
    };
  }

  async eventToAssignReport(paginationDto: PaginationDto) {
    const {page,pageSize}=paginationDto;
    const [events,total] = await this.eventRepository.findAndCount({
      where: { reportPublishType:In[reportPublishType.created,reportPublishType.published], status: eventStatus.completed },
      // where: {status: eventStatus.completed },
      relations: ['bookingDate.booking.enrollPackage.package'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
      select: {
        id: true,
        reportPublishType: true,
        createdAt:true,
        bookingDate: {
          id: true,
          date: true,
          booking: {
            id: true,
            enrollPackage: {
              id: true,
              participant: true,
              package: {
                id: true,
                name: true,
                price: true,
                img: true,
                description: true,
              },
            },
          },
        },
      },
    });
    return {
      events,
      total,
      page,
      pageSize
    };
  }

  async updateEventStatus(id: string, status: eventStatus) {

    if(status===eventStatus.completed){
      const event=await this.eventRepository.findOne({
        where:{id},
        relations:['subteam.subTeam.service']
      });
      // console.log(event);
      const serviceId=event?.subteam[0]?.subTeam.service.id;
      if(!serviceId){
        throw new ForbiddenException('service not found')
      }
      const report=this.reportRepository.create({
        event:{id},
        service:{id:serviceId}
      });
      await this.reportRepository.save(report);
    }
    await this.eventRepository.update(
      { id },
      { status, updatedAt: new Date() },
    );
 
    return true;
  }

  async getCompletedInfo(id: string) {
    const eventInfo = await this.eventRepository.findOne({
      where: { id },
      relations: [
        'eventFeedback',
        'bookingDate.booking.client',
        'bookingDate.booking.enrollPackage',
        'bookingDate.booking.eventCalender.service',
      ],
      select: {
        id: true,
        status: true,
        eventFeedback: {
          id: true,
          rating: true,
          feedback: true,
        },
        bookingDate: {
          id: true,
          date: true,
          booking: {
            id: true,
            venue: true,
            client: {
              id: true,
              name: true,
            },
            enrollPackage: {
              id: true,
              participant: true,
            },
            eventCalender: {
              id: true,
              slot: true,
              service: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });
    return eventInfo;
  }

  async changeSubTeam(id: string, subTeamId: string) {
    const updatedSubteam = await this.eventSubteamRepository.update(
      { id },
      { subTeam: { id: subTeamId } },
    );
    if (updatedSubteam.affected === 0) {
      throw new ForbiddenException('invalid request');
    }
    return true;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['bookingDate.booking.enrollPackage'],
    });
    // console.log(event);
    const booking = await this.bookingRepository.findOne({
      where: { id: event.bookingDate.booking.id },
      relations: ['bookingDates.event'],
      select: {
        id: true,
        bookingDates: {
          id: true,
          event: {
            id: true,
            participant: true,
          },
        },
      },
    });

    // console.log(event);

    let totalEnrolledParticipant = 0;
    booking.bookingDates.forEach((booking) => {
      if (booking.event) {
        totalEnrolledParticipant += booking?.event?.participant;
      }
    });

    const maxParticipant =
      event?.bookingDate?.booking?.enrollPackage?.participant;
    const availableEnrollParticipant =
      maxParticipant - totalEnrolledParticipant;
    const currentEventParticipant = event.participant;

    // console.log('total enroll particpant:',totalEnrolledParticipant);
    // console.log('avail particpant:',availableEnrollParticipant);

    if (
      totalEnrolledParticipant -
        currentEventParticipant +
        updateEventDto.participant <=
      maxParticipant
    ) {
      const updatedEvent = Object.assign(event, updateEventDto);
      await this.eventRepository.save(updatedEvent);
      return true;
    } else {
      throw new ForbiddenException({
        message: `You can add participant upto ${availableEnrollParticipant + currentEventParticipant}`,
      });
    }
  }

   async isSubteamAssignDate(id:string,subTeamId:string){
    const bookingDate=await this.bookingDateRepository.findOne({where:{id}});
    const subTeam=await this.subTeamRepository.find({
      where:{
        id:subTeamId,
        event:{
          event:{
            bookingDate:{
              date:bookingDate.date
            }
          }
        }
      },
    });

    return subTeam.length>0?true:false
}

 
}


