import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAssignCalendarDto } from './dto/update-_assign_calendar.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { eventCalendarEntity } from 'src/model/sql/eventCalendar.entity';
import { In, Repository } from 'typeorm';
import { CreateEventCalendarDto } from './dto/create-_assign_calendar.dto';
import { serviceEntity } from 'src/model/sql/service.entity';
import { clientEntity } from 'src/model/sql/client.entity';
import { format } from 'date-fns';
import { packageEntity } from 'src/model/sql/package.entity';
import { calenderEntity } from 'src/model/sql/serviceCalender.entity';
import { bookingEntity } from 'src/model/sql/booking.entity';
import { bookingStatus } from 'src/helper/types/index.type';
import { bookingDateEntity } from 'src/model/sql/booking_date.entity';

@Injectable()
export class AssignCalendarService {
  constructor(
    @InjectRepository(eventCalendarEntity)
    private eventCalendarRepo: Repository<eventCalendarEntity>,

    @InjectRepository(packageEntity)
    private packageRepo: Repository<packageEntity>,

    @InjectRepository(bookingEntity)
    private bookingRepo: Repository<bookingEntity>,

    @InjectRepository(serviceEntity)
    private readonly serviceRepository: Repository<serviceEntity>,

    @InjectRepository(clientEntity)
    private readonly clientRepository: Repository<clientEntity>,

    @InjectRepository(calenderEntity)
    private readonly calenderRepository: Repository<calenderEntity>,

    @InjectRepository(bookingDateEntity)
    private readonly bookingDateRepository: Repository<bookingDateEntity>,
  ) {}

  async create(createEventCalendarDto: CreateEventCalendarDto) {
    const { enrollId, serviceId, clientId, slot, startDate, endDate } =
      createEventCalendarDto;

    // console.log(createEventCalendarDto);
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
    });
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    if (!client || !service) {
      throw new NotFoundException(`Invalid request payload`);
    }
    const existingData = await this.eventCalendarRepo.findOne({
      where: {
        enrollment: { id: enrollId },
        service: {
          id: serviceId,
        },
        isDisable: false,
        client: { id: clientId },
      },
    });
    if (existingData) {
      throw new ForbiddenException('Calendar already asigned');
    }
    const start = format(new Date(startDate), 'yyyy-MM-dd');
    const end = format(new Date(endDate), 'yyyy-MM-dd');
    // console.log(start,end)

    const eventCalendar = this.eventCalendarRepo.create({
      enrollment: { id: enrollId },
      service,
      client,
      endDate: end,
      startDate: start,
      slot,
    });
    return await this.eventCalendarRepo.save(eventCalendar);
  }

  async findOne(service: string, client: string, enrollId: string) {
    const eventCalendar = await this.eventCalendarRepo.findOne({
      where: {
        enrollment: { id: enrollId },
        service: { id: service },
        isDisable: false,
        client: { id: client },
      },
    });
    return eventCalendar;
  }

  async update(
    id: string,
    updateEventCalendarDto: UpdateAssignCalendarDto,
  ): Promise<eventCalendarEntity> {
    const { serviceId, clientId, slot, startDate, endDate } =
      updateEventCalendarDto;

    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
    });
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    if (!client || !service) {
      throw new NotFoundException('Invalid request payload');
    }
    // const existingData = await this.eventCalendarRepo.findOne({
    //   where: { service: { id: serviceId }, isDisable: false }
    // })
    // if (existingData) {
    //   throw new ForbiddenException('Calendar already assigned');
    // }
    const eventCalendar = await this.eventCalendarRepo.findOne({
      where: { id },
    });
    if (!eventCalendar) {
      throw new NotFoundException('Event Calendar not found');
    }
    eventCalendar.service = service;
    eventCalendar.client = client;
    eventCalendar.startDate = new Date(startDate);
    eventCalendar.endDate = new Date(endDate);
    eventCalendar.slot = slot;

    return await this.eventCalendarRepo.save(eventCalendar);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.eventCalendarRepo.delete(id);
    return result.affected > 0;
  }

  // ==================================================
  // async geteventCalendar(service, user) {
  //   const calenderToWork = await this.calenderRepository.findOne({ where: { service: { id: service } } });
  //   const serviceCalendarData = await this.calenderRepository.findOne({
  //     where: { id: calenderToWork.id }, relations: ["dateSlots", "service"],
  //   })
  //   console.log(serviceCalendarData);

  //   const existingCalendar = await this.eventCalendarRepo.findOne({
  //     where: {
  //       client: { id: user },
  //       service: { id: service },
  //       isDisable: false
  //     }
  //   })

  //   if (!existingCalendar) {
  //     throw new ForbiddenException("Calender not assigned yet.")
  //   }
  //   const responseArr = [
  //     {
  //       startDate: existingCalendar.startDate,
  //       endDate: existingCalendar.endDate,
  //       eventCalendar: []
  //     }
  //   ]
  //   serviceCalendarData.dateSlots.map(async (item) => {
  //     const bookedDate = await this.bookingRepo.find({
  //       where: {
  //         serviceCalendar:
  //           { id: serviceCalendarData.id },
  //         status: bookingStatus.hold,
  //         bookingDate: item.date.toString()
  //       }
  //     })
  //     responseArr[0].eventCalendar.push(
  //       {
  //         date: item.date,
  //         isBookable: item.slot === bookedDate.length
  //       }
  //     )
  //   })
  //   return responseArr
  // }
  // async geteventCalendar(service: string, user: string) {
  //   const calenderToWork = await this.serviceRepository.findOne({
  //     where: { id: service },
  //   });
  //   // console.log(service);
  //   if (!calenderToWork) {
  //     throw new ForbiddenException('Service not found.');
  //   }

  //   const serviceCalendarData = await this.calenderRepository.findOne({
  //     where: { service: { id: calenderToWork.id } },
  //     relations: ['dateSlots', 'service'],
  //   });
  //   if (!serviceCalendarData) {
  //     throw new ForbiddenException('Service calendar data not found.');
  //   }

  //   const existingCalendar = await this.eventCalendarRepo.findOne({
  //     where: {
  //       client: { id: user },
  //       service: { id: service },
  //       isDisable: false,
  //     },
  //   });

  //   if (!existingCalendar) {
  //     throw new ForbiddenException('Calendar not assigned yet.');
  //   }

  //   // Initialize the response array
  //   const responseArr = [
  //     {
  //       id: '',
  //       startDate: existingCalendar.startDate.toISOString(),
  //       endDate: existingCalendar.endDate.toISOString(),
  //       eventCalendarId: existingCalendar.id,
  //       eventCalendar: [],
  //     },
  //   ];
  //   // console.log("slots info", serviceCalendarData);
  //   const eventCalendarPromises = serviceCalendarData.dateSlots.map(
  //     async (item) => {
  //       // console.log("dataslot item", item, item.date.toISOString(), item.date.toISOString().slice(0,10));
  //       const bookedDate = await this.bookingRepo.find({
  //         where: {
  //           serviceCalendar: { id: serviceCalendarData.id },
  //           status: bookingStatus.hold || bookingStatus.booked,
  //           // @ts-ignore
  //           bookingDates: {
  //             booking: {
  //               bookingDates: { date: item.date.toISOString().slice(0, 10) },
  //             },
  //           },
  //         },
  //       });
  //       // console.log(new Date(item.date).toLocaleDateString('en-CA'));
  //       // console.log("bookedDate", bookedDate);
  //       // ====================================
  //       if (!bookedDate.length) {
  //         return {
  //           date: item.date.toISOString().substring(0, 10),
  //           isBookable: !item.isDisabled,
  //           bookableSlot: item.slot,
  //         };
  //       }
  //       // console.log(item,item.slot, bookedDate.length);
  //       return {
  //         date: item.date.toISOString().substring(0, 10),
  //         isBookable:
  //           item.isDisabled === true ? false : item.slot > bookedDate.length,
  //         bookableSlot: item.slot - bookedDate.length,
  //       };
  //     },
  //   );
  //   const bookingIds = await this.bookingRepo.find({
  //     where: {
  //       serviceCalendar: { id: serviceCalendarData.id },
  //       status: bookingStatus.hold || bookingStatus.booked,
  //     },
  //     select: ['id'],
  //   });
  //   const bookingIdsArr = bookingIds.map((item) => item.id);
  //   const bookingDates = await this.bookingDateRepository.find({
  //     where: { booking: { id: In(bookingIdsArr) } },
  //   });
  //   const bookingDatesArr = Array.from(
  //     new Set(bookingDates.map((item) => item.date)),
  //   );
  //   // console.log(bookingDatesArr);
  //   // console.log(serviceCalendarData.dateSlots);
  //   // console.log('***************************');
  //   const bookingDatesPromises = bookingDatesArr.map(async (item) => {
  //     const exists = serviceCalendarData.dateSlots.some(
  //       // @ts-ignore
  //       (slot) => slot.date.toISOString().slice(0, 10) === item,
  //     );
  //     if (!exists) {
  //       return {
  //         date: item,
  //         isBookable: false,
  //         bookableSlot: 0,
  //       };
  //     } else {
  //       const existingSlot = serviceCalendarData.dateSlots.filter(
  //         (dateItem) => {
  //           // @ts-ignore
  //           return dateItem.date.toISOString().slice(0, 10) == item;
  //         },
  //       );
  //       // console.log('#########');
  //       // console.log(item);
  //       // console.log(existingSlot);
  //       const countTotalBookingOfDate = await this.bookingDateRepository.count({
  //         where: { date: item },
  //       });
  //       return {
  //         date: item,
  //         isBookable:
  //           existingSlot[0].isDisabled === true
  //             ? false
  //             : existingSlot[0].slot > countTotalBookingOfDate,
  //         bookableSlot: existingSlot[0].slot - countTotalBookingOfDate,
  //       };
  //     }
  //   });
  //   const eventCalendarData = await Promise.all(eventCalendarPromises);
  //   const resolvedBookingDates = await Promise.all(bookingDatesPromises);
  //   console.log(eventCalendarData);
  //   console.log("********");
  //   console.log(bookingDatesPromises);
  //   responseArr[0].eventCalendar.push(
  //     ...eventCalendarData,
  //     ...resolvedBookingDates,
  //   );
  //   responseArr[0].id = serviceCalendarData.id;
  //   return responseArr;
  // }

  async getEventCalendar(enrollId: string, serviceId: string, userId: string) {
    // Fetch the service details
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
    });
    if (!service) {
      throw new ForbiddenException('Service not found.');
    }

    // Fetch the service calendar data
    const serviceCalendar = await this.calenderRepository.findOne({
      where: { 
        service: { id: service.id } ,
        
      },
      relations: ['dateSlots', 'service'],
    });
    if (!serviceCalendar) {
      throw new ForbiddenException('Service calendar data not found.');
    }

    // Check if the user has an assigned calendar
    const userCalendar = await this.eventCalendarRepo.findOne({
      where: {
        enrollment: {id: enrollId},
        client: { id: userId },
        service: { id: serviceId },
        isDisable: false,
      },
    });
    if (!userCalendar) {
      throw new ForbiddenException('Calendar not assigned yet.');
    }

    // Initialize response structure
    const response = [
      {
        id: serviceCalendar.id,
        startDate: userCalendar.startDate.toISOString(),
        endDate: userCalendar.endDate.toISOString(),
        requestedSlot: userCalendar.slot,
        eventCalendarId: userCalendar.id,
        eventCalendar: [],
      },
    ];

    // Fetch all booked dates
    const bookedSlots = await this.bookingRepo.find({
      where: {
        serviceCalendar: { id: serviceCalendar.id },
        status: In([
          bookingStatus.hold,
          bookingStatus.booked,
          bookingStatus.completed,
        ]),
      },
      select: ['id'],
    });

    const bookedSlotIds = bookedSlots.map((slot) => slot.id);
    const bookedDates = await this.bookingDateRepository.find({
      where: { booking: { id: In(bookedSlotIds) } },
    });

    const bookedDatesSet = new Set(bookedDates.map((item) => item.date));

    // Process service calendar date slots
    const calendarPromises = serviceCalendar.dateSlots.map(async (slot) => {
      const dateStr = slot.date.toISOString().substring(0, 10);
      const bookingsForDate = await this.bookingDateRepository.count({
        // @ts-ignore
        where: { date: dateStr },
      });

      return {
        date: dateStr,
        isBookable: !slot.isDisabled && slot.slot > bookingsForDate,
        bookableSlot: slot.isDisabled ? 0 : slot.slot - bookingsForDate,
      };
    });

    // Process additional booked dates not in the service calendar
    const extraBookedDatesPromises = Array.from(bookedDatesSet).map(
      async (date) => {
        const dateStr = new Date(date).toISOString().substring(0, 10);
        const matchingSlot = serviceCalendar.dateSlots.find(
          (slot) => slot.date.toISOString().substring(0, 10) === dateStr,
        );

        if (!matchingSlot) {
          return { date: dateStr, isBookable: false, bookableSlot: 0 };
        }

        const totalBookings = await this.bookingDateRepository.count({
          // @ts-ignore
          where: { date: dateStr },
        });

        return {
          date: dateStr,
          isBookable:
            !matchingSlot.isDisabled && matchingSlot.slot > totalBookings,
          bookableSlot: matchingSlot.slot - totalBookings,
        };
      },
    );

    // Resolve all promises
    const resolvedCalendar = await Promise.all(calendarPromises);
    const resolvedExtraDates = await Promise.all(extraBookedDatesPromises);

    // Merge and append to response
    response[0].eventCalendar.push(...resolvedCalendar, ...resolvedExtraDates);

    return response;
  }

  // ===============================================

  async getServicesOfPackage(enrollId: string, user, pckg) {
    const existingPackage = await this.packageRepo.findOne({
      where: { id: pckg },
      relations: ['service'],
    });
    if (!existingPackage) {
      throw new ForbiddenException('Forbidden request');
    }

    const existingCalendar = await this.eventCalendarRepo.find({
      where: {
        enrollment: { id: enrollId },
        client: { id: user },
        isDisable: false,
      },
      relations: ['service', 'client'],
    });
    // console.log(existingPackage);
    // console.log(existingCalendar);
    const result = existingPackage.service.map((service) => {
      const isCalendarOpen = existingCalendar.some(
        (item) => item.service.id === service.id,
      );
      return {
        id: service.id,
        name: service.name,
        isCalendarOpen: isCalendarOpen,
      };
    });
    // console.log(result);
    return result;
  }
}
