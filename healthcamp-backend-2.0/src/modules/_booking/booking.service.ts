import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BookingDate, CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { bookingEntity } from 'src/model/sql/booking.entity';
import { In, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { UUID } from 'crypto';
import {
  bookingStatus,
  eventStatus,
  JwtPayload,
  reportForwardBy,
  reportPublishType,
} from 'src/helper/types/index.type';
import { eventCalendarEntity } from 'src/model/sql/eventCalendar.entity';
import { calenderEntity } from 'src/model/sql/serviceCalender.entity';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { clientEntity } from 'src/model/sql/client.entity';
import { rejectCommentDto } from '../_kyc/dto/create-kycComment.dto';
import { bookingDateEntity } from 'src/model/sql/booking_date.entity';
import { enrollEntity } from 'src/model/sql/enrollment.entity';
import { format, formatDate } from 'date-fns';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(bookingEntity)
    private bookingRepository: Repository<bookingEntity>,

    @InjectRepository(bookingDateEntity)
    private bookingDateRepository: Repository<bookingDateEntity>,

    @InjectRepository(eventCalendarEntity)
    private eventCalendarRepository: Repository<eventCalendarEntity>,

    @InjectRepository(clientEntity)
    private clientRepository: Repository<clientEntity>,
  ) {}

  // async bookTheEvent(createBookingDto: CreateBookingDto, user) {
  //   const { serviceCalendarId, bookingDate, eventCalendarId } = createBookingDto;

  //   const eventCalendarDetail = await this.eventCalendarRepository.findOne({ where: { id: eventCalendarId } });
  //   if (!eventCalendarDetail) {
  //     throw new ForbiddenException("Unasigned calendar can't be booked")
  //   }
  //   console.log(eventCalendarDetail);
  //   const isCLientFull = await this.bookingRepository.find({
  //     where: {
  //       client: { id: user.sub },
  //       serviceCalendar: { id: serviceCalendarId },
  //       status: bookingStatus.hold,
  //       province:
  //     }
  //   })
  //   console.log(isCLientFull);
  //   if (eventCalendarDetail.slot <= (await isCLientFull).length) {
  //     throw new BadRequestException(`Not allowed to book more than ${eventCalendarDetail.slot} times.`)
  //   }
  //   // const booking = this.bookingRepository.create({
  //   //   bookingDate: bookingDate,
  //   //   client: { id: user.sub },
  //   //   serviceCalendar: { id: serviceCalendarId },
  //   // });
  //   // return await this.bookingRepository.save(booking);
  // }

  async bookTheEvent(createBookingDto: CreateBookingDto, user) {
    const {
      serviceCalendarId,
      bookingDates,
      eventCalendarId,
      enrollPackageId,
    } = createBookingDto;
    console.log(createBookingDto);
    const eventCalendarDetail = await this.eventCalendarRepository.findOne({
      where: { id: eventCalendarId },
    });
    if (!eventCalendarDetail) {
      throw new ForbiddenException("Unassigned calendar can't be booked");
    }

    // Check if client has already booked the maximum allowed slots
    const existingBookings = await this.bookingRepository.find({
      where: {
        client: { id: user.sub },
        serviceCalendar: { id: serviceCalendarId },
        eventCalender: { id: eventCalendarId },
        enrollPackage: { id: enrollPackageId },
      },
    });
    console.log(existingBookings);
    if (existingBookings.length > 0) {
      throw new ForbiddenException('Event is already booked.');
    }

    if (eventCalendarDetail.slot !== createBookingDto.bookingDates.length) {
      throw new BadRequestException(
        `you need to book ${eventCalendarDetail.slot} slot(s).`,
      );
    }

    // Create and save the booking
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      client: { id: user.sub },
      eventCalender: eventCalendarDetail,
      enrollPackage: { id: enrollPackageId },
      serviceCalendar: { id: serviceCalendarId },
      bookingDates: bookingDates.map((date) => ({ date })),
    });
    return await this.bookingRepository.save(booking);
  }

  async getClientBooking(
    enrollId: string,
    user,
    id: UUID,
    status: bookingStatus,
  ) {
    // const serviceCalendar = await this.serviceCalendarRepository.findOne({
    //   where: {
    //     service: { id: service },
    //   },
    // });
    // console.log(serviceCalendar)
    // const bks=await this.bookingRepository.find({
    //   relations:['serviceCalendar','client','bookingDates'],
    // });
    // // console.log(bks)
    // if (!serviceCalendar) {
    //   throw new ForbiddenException("Service is not created yet.")
    // }
    const existingBooking = await this.bookingRepository.find({
      where: {
        serviceCalendar: { service: { id } },
        status: status,
        client: { id: user.sub },
        enrollPackage: { id: enrollId },
      },
      relations: ['serviceCalendar', 'bookingDates'],
      select: {
        id: true,
        status: true,
        bookingDates: {
          date: true,
        },
      },
    });
    return existingBooking;
  }

  async getAllBooking(
    user: JwtPayload,
    paginationDto: PaginationDto,
    status: bookingStatus,
  ) {
    const existingClients = await this.clientRepository.find({
      where: { teamLead: { id: user.sub } },
      select: ['id'],
    });

    const clientIds = existingClients.map((client) => client.id);

    if (clientIds.length === 0) {
      return [];
    }

    const { page, pageSize } = paginationDto;
    const skip = (page - 1) * pageSize;
    const [bookings, total] = await this.bookingRepository.findAndCount({
      where: { client: { id: In(clientIds) }, status: status },
      take: pageSize,
      skip,
    });

    return {
      bookings,
      page,
      pageSize,
      total,
    };
  }

  // async getBooking(user: JwtPayload, paginationDto: PaginationDto) {
  //   const existingClients = await this.clientRepository.find({
  //     where: { teamLead: { id: user.sub } },
  //     select: ['id'],
  //   });

  //   const clientIds = existingClients.map((client) => client.id);

  //   if (clientIds.length === 0) {
  //     return [];
  //   }

  //   const { page, pageSize } = paginationDto;
  //   const skip = (page - 1) * pageSize;

  //   const booking=await this.bookingRepository.find({
  //     where:{client:{teamLead:{id:user.sub}}},
  //     take: pageSize,
  //     skip,
  //   })

  //   const bookings = await this.bookingRepository.find({
  //     where: { client: { id: In(clientIds) }},
  //     take: pageSize,
  //     skip,
  //   });
  //   return bookings;
  // }

  async getBooking(user: JwtPayload, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [clients, total] = await this.bookingRepository.findAndCount({
      where: { client: { teamLead: { id: user.sub } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      clients,
      total,
      page,
      pageSize,
    };
  }

  async findBookedEvent(id: string, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [events, total] = await this.bookingRepository.findAndCount({
      where: {
        client: { teamLead: { id } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['client'],
      select: {
        id: true,
        status: true,
        createdAt: true,
        client: {
          id: true,
          name: true,
          email: true,
          profile: true,
        },
      },
    });
    return {
      events,
      total,
      page,
      pageSize,
    };
  }

  async findClientBookedEvent(id: string) {
    const events = await this.bookingRepository.find({
      where: {
        client: { id },
      },
      relations: ['enrollPackage.package', 'bookingDates'],
      select: {
        id: true,
        venue: true,
        status: true,
        createdAt: true,
        enrollPackage: {
          id: true,
          package: {
            id: true,
            name: true,
            description: true,
          },
        },
        bookingDates: {
          id: true,
          date: true,
        },
      },
    });
    return events;
  }

  async findBooking(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: [
        'client',
        'eventCalender',
        'enrollPackage',
        'serviceCalendar.service',
        'bookingDates',
      ],
      select: {
        client: {
          id: true,
          name: true,
          address: true,
        },
        eventCalender: {
          id: true,
          slot: true,
        },
        enrollPackage: {
          id: true,
          participant: true,
        },
        serviceCalendar: {
          id: true,
          service: {
            id: true,
            name: true,
            description: true,
          },
        },
        bookingDates: {
          id: true,
          date: true,
        },
      },
    });
    return booking;
  }

  async findEventBooking(id: string) {
    const bookingDateEvent = await this.bookingDateRepository.findOne({
      where: { id },
      relations: [
        'event',
        'booking.client',
        'booking.eventCalender',
        'booking.enrollPackage',
        'booking.serviceCalendar.service',
      ],
      select: {
        id: true,
        date: true,
        event: {
          id: true,
          participant: true,
        },
        booking: {
          id: true,
          venue: true,
          client: {
            id: true,
            name: true,
            profile: true,
          },
          eventCalender: {
            id: true,
            slot: true,
          },
          enrollPackage: {
            id: true,
            participant: true,
          },
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
    });
    // console.log(bookingDateEvent);
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingDateEvent.booking.id },
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

    // console.log(booking);

    let totalEnrolledParticipant = 0;
    booking.bookingDates.forEach((booking) => {
      if (booking.event) {
        totalEnrolledParticipant += booking?.event?.participant;
      }
    });

    return {
      ...bookingDateEvent,
      availableEnrollParticipant:
        bookingDateEvent.booking.enrollPackage.participant -
        totalEnrolledParticipant,
    };
  }

  async findBookingEvent(id: string) {
    const booking = await this.bookingDateRepository.findOne({
      where: { id },
      relations: ['event.subteam.subTeam'],
      select: {
        id: true,
        event: {
          id: true,
          subteam: {
            id: true,
            subTeam: {
              id: true,
              name: true,
            },
          },
        },
      },
    });
    return { subteam: booking?.event?.subteam ? booking.event.subteam : false };
  }

  async clientBookedEvent(id: string, status: eventStatus) {
    const condition = this.queryCondition(status);
    const events = await this.bookingRepository.find({
      where: {
        client: { id },
        ...condition,
      },
      relations: ['serviceCalendar.service', 'bookingDates.event'],
      select: {
        id: true,
        status: true,
        venue: true,
        serviceCalendar: {
          id: true,
          service: {
            id: true,
            name: true,
            description:true
          },
        },
        bookingDates: {
          id: true,
          date: true,
          event: {
            id: true,
          },
        },
      },
    });
    console.log(events);
    return events;
  }

  async acceptBooking(id: string) {
    const response = await this.bookingRepository.update(
      { id, status: bookingStatus.hold },
      { status: bookingStatus.booked, comment: null },
    );
    if (response.affected == 0) {
      throw new ForbiddenException('already updated');
    }
    return true;
  }

  async rejectBooking(id: string, body: rejectCommentDto) {
    const response = await this.bookingRepository.update(
      { id, status: bookingStatus.hold },
      { status: bookingStatus.cancel, comment: body.comment },
    );
    if (response.affected == 0) {
      throw new ForbiddenException('already updated');
    }
    return true;
  }

  async upcomingEvent(id: string) {
    const booking = await this.bookingDateRepository.find({
      where: [
        {
          booking: {
            status: bookingStatus.booked,
            client: {
              teamLead: { id },
            },
          },
        },
      ],
      relations: [
        'event.subteam.subTeam',
        'booking.client',
        'booking.serviceCalendar.service',
      ],
      select: {
        id: true,
        date: true,
        createdAt: true,
        event: {
          id: true,
          status: true,
          subteam: {
            id: true,
            subTeam: {
              id: true,
              name: true,
            },
          },
        },
        booking: {
          id: true,
          venue: true,
          status: true,
          // bookingDates: {
          //   id: true,
          //   date: true,
          // },
          client: {
            id: true,
            name: true,
          },
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
      order: {
        date: 'ASC',
      },
    });

    const filterData = booking.filter(
      (booking) =>
        !booking.event || booking.event.status == eventStatus.pending,
    );
    return filterData;
  }

  async completedEvent(id: string, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [booking, total] = await this.bookingDateRepository.findAndCount({
      where: [
        {
          booking: {
            status: bookingStatus.booked,
            client: {
              teamLead: { id },
            },
          },
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['event.subteam.subTeam', 'booking.serviceCalendar.service'],
      select: {
        id: true,
        date: true,
        createdAt: true,
        event: {
          id: true,
          status: true,
          subteam: {
            id: true,
            subTeam: {
              id: true,
              name: true,
            },
          },
        },
        booking: {
          id: true,
          venue: true,
          status: true,
          // bookingDates: {
          //   id: true,
          //   date: true,
          // },
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
      order: {
        date: 'ASC',
      },
    });

    const filterData = booking.filter(
      (booking) =>
        booking.event && booking.event.status == eventStatus.completed,
    );
    return {
      filterData,
      total,
      page,
      pageSize,
    };
  }

  async completedEventDataEntry(reportPublishType:reportPublishType, id: string, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [booking, total] = await this.bookingRepository.findAndCount({
      where: {
        bookingDates: {
          event: {
            status: eventStatus.completed,
            reportPublishType,
            subteam: { subTeam: { admin: { id } } },
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: [
        'client',
        'serviceCalendar.service',
        'bookingDates.event.report',
      ],
      select: {
        id: true,
        createdAt: true,
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
        bookingDates: {
          id: true,
          date: true,
          event: {
            id: true,
            participant: true,
            reportPublishType:true,
            report: {
              id: true,
            },
          },
        },
      },
      order: {
        createdAt: 'ASC',
        bookingDates: {
          date: 'ASC',
        },
      },
    });
    return {
      events: booking,
      total,
      page,
      pageSize,
    };
  }

  async reportPublishedEvents(publish:boolean, id: string, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    console.log("publish type:",publish);

    const [events, total] = await this.bookingRepository.findAndCount({
      where: {
        status:bookingStatus.completed,
        bookingDates:{event:{reportForwardBy:publish?reportForwardBy.teamLead:null}},
        client: {
          teamLead: { id },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['bookingDates.event.report', 'client', 'serviceCalendar.service'],
      select: {
        id: true,
        venue: true,
        createdAt: true,
        bookingDates: {
          id: true,
          date: true,
          event: {
            id: true,
            participant:true,
            reportPublishType:true,
            report:{
              id:true
            }
          },
        },
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
      order: {
        createdAt: 'ASC',
        bookingDates: {
          date: 'ASC',
        },
      },
    });
    return {
      events,
      total,
      page,
      pageSize,
    };
  }

  async reportForwardedEvent(id: string, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [events, total] = await this.bookingRepository.findAndCount({
      where: {
        status:bookingStatus.completed,
        bookingDates:{event:{reportForwardBy:reportForwardBy.teamLead}},
        client: {id },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['bookingDates', 'serviceCalendar.service'],
      select: {
        id: true,
        venue: true,
        createdAt: true,
        bookingDates: {
          id: true,
          date: true,
        },
        serviceCalendar: {
          id: true,
          service: {
            id: true,
            name: true,
          },
        },
      },
      order: {
        createdAt: 'ASC',
        bookingDates: {
          date: 'ASC',
        },
      },
    });
    return {
      booking:events,
      total,
      page,
      pageSize,
    };
  }

  async forwardedEventReport(id: string, paginationDto: PaginationDto) {
    // console.log(id)
    const { page, pageSize } = paginationDto;
    const [booking, total] = await this.bookingDateRepository.findAndCount({
      where: [
        {
          event: {
            status: eventStatus.completed,
            reportPublishType: reportPublishType.forwarded,
          },
          booking: {
            client: {
              teamLead: { id },
            },
          },
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: [
        'event.report.trackReport',
        'booking.client',
        'booking.serviceCalendar.service',
      ],
      select: {
        id: true,
        date: true,
        createdAt: true,
        event: {
          id: true,
          participant: true,
          status: true,
          report: {
            id: true,
            trackReport: {
              id: true,
            },
          },
        },
        booking: {
          id: true,
          venue: true,
          status: true,
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
      order: {
        date: 'DESC',
      },
    });
    //  return booking;
    const filterEvent = booking.filter(
      (item) =>
        item?.event?.report[0]?.trackReport?.length == item?.event?.participant,
    );

    const result = filterEvent.map(({ id, date, event, booking }) => ({
      id,
      date,
      eventId: event.id,
      participant: event.participant,
      client: booking.client.name,
      service: booking.serviceCalendar.service.name,
    }));

    return {
      event: result,
      total,
      page,
      pageSize,
    };
  }

  async bookingEventParticipant(id:string){
    const booking=await this.bookingRepository.findOne({
      where:{id},
      relations:['bookingDates.event.report.trackReport.participant'],
      select:{
        id:true,
        bookingDates:{
          id:true,
          event:{
            id:true,
            report:{
              id:true,
              trackReport:{
                id:true,
                reportForwardStatus:true,
                participant:{
                  id:true,
                  name:true,
                  gender:true,
                  grade:true,
                  email:true
                }
              }
            }
          }
        }
      }
    });

    const participantsWithStatus = [];

    for (const bookingDate of booking.bookingDates) {
      const trackReports = bookingDate?.event?.report?.trackReport ?? [];
  
      for (const track of trackReports) {
        const participant = track.participant;
        if (participant) {
          participantsWithStatus.push({
            ...participant,
            reportForwardStatus: track.reportForwardStatus,
          });
        }
      }
    }
  
    return participantsWithStatus;
  }

  // async clientForwardedEventReport(id: string) {
  //   const booking = await this.bookingDateRepository.find({
  //     where: [
  //       {
  //         event: {
  //           status: eventStatus.completed,
  //           reportPublishType: reportPublishType.forwarded,
  //         },
  //         booking: {
  //           client: { id },
  //         },
  //       },
  //     ],
  //     relations: ['event.report', 'booking.serviceCalendar.service'],
  //     select: {
  //       id: true,
  //       date: true,
  //       createdAt: true,
  //       event: {
  //         id: true,
  //         participant: true,
  //         status: true,
  //         report: {
  //           id: true,
  //         },
  //       },
  //       booking: {
  //         id: true,
  //         serviceCalendar: {
  //           id: true,
  //           service: {
  //             id: true,
  //             name: true,
  //           },
  //         },
  //       },
  //     },
  //     order: {
  //       date: 'DESC',
  //     },
  //   });

  //   const result = booking?.map(({ id, date, event, booking }) => ({
  //     id,
  //     date,
  //     eventId: event.id,
  //     participant: event.participant,
  //     service: booking.serviceCalendar.service.name,
  //   }));

  //   return {
  //     event: result,
  //   };
  // }

  async updateBooking(id: string, booking: BookingDate) {
    const date = booking.bookingDate;
    const fd = new Date(date);
    const formattedDate = format(fd, 'yyyy-M-d');
    await this.bookingDateRepository.update({ id }, { date: formattedDate });
    return true;
  }

  queryCondition(status: eventStatus) {
    if (status == eventStatus.pending) {
      return { status: bookingStatus.booked };
    } else if (status == eventStatus.completed) {
      return { bookingDates: { event: { status: eventStatus.completed } } };
    }
  }
}
