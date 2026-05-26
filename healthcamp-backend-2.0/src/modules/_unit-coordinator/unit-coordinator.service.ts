import { Injectable } from '@nestjs/common';
import { CreateUnitCoordinatorDto } from './dto/create-unit-coordinator.dto';
import { UpdateUnitCoordinatorDto } from './dto/update-unit-coordinator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { eventEntity } from 'src/model/sql/event.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { serviceEntity } from 'src/model/sql/service.entity';
import {
  bookingStatus,
  deptType,
  eventStatus,
} from 'src/helper/types/index.type';
import { adminEntity } from 'src/model/sql/admin.entity';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Injectable()
export class UnitCoordinatorService {
  constructor(
    @InjectRepository(eventEntity)
    private readonly eventRepository: Repository<eventEntity>,

    @InjectRepository(serviceEntity)
    private readonly serviceRepository: Repository<serviceEntity>,

    @InjectRepository(adminEntity)
    private readonly adminRepository: Repository<adminEntity>,
  ) {}

  async upcomingEvent(
    id: string,
    status: eventStatus,
    paginationDto: PaginationDto,
  ) {
    const { page, pageSize } = paginationDto;
    const [events, total] = await this.eventRepository.findAndCount({
      where: {
        status,
        subteam: {
          subTeam: {
            admin: { id },
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: [
        'subteam.subTeam.admin',
        'bookingDate.booking.client',
        'bookingDate.booking.serviceCalendar.service',
      ],
      order: {
        createdAt: 'DESC',
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        subteam: {
          id: true,
          subTeam: {
            id: true,
            admin: {
              id: true,
            },
          },
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
    return { events, total, page, pageSize };
  }

  async getCompletedEvent(id: string, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [event, total] = await this.eventRepository.findAndCount({
      where: {
        subteam: { subTeam: { admin: { id } } },

        // date:MoreThan(new Date())
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { event, total, page, pageSize };
  }

  async getClientService(id: string, serviceId: string) {
    // console.log(id)
    const clients = await this.serviceRepository.find({
      where: {
        id: serviceId,
        package: {
          enroll: {
            booking: { bookingDates: { date: MoreThan(new Date()) } },
            client: { teamLead: { leadTeam: { admin: { id } } } },
          },
        },
      },
      relations: ['package.enroll.booking.client'],
      select: {
        id: true,
        package: {
          id: true,
          enroll: {
            id: true,
            booking: {
              id: true,
              client: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return clients;
  }

  findAll() {
    return `This action returns all unitCoordinator`;
  }

  async findOne(id: string) {
    const unitInfo = await this.adminRepository.findOne({
      where: {
        id,
        department: deptType.unitCoordinator,
      },
      relations: [
        'subTeam.team.teamLeader',
        // 'subTeam.admin',
        'subTeam.custom',
        'subTeam.service',
      ],
      select: {
        id: true,
        name: true,
        profile: true,
        email: true,
        subTeam: {
          id: true,
          name: true,
          // admin: {
          //   id: true,
          //   name: true,
          //   profile: true,
          //   contact:true,
          //   email:true,
          //   department:true
          // },
          team: {
            id: true,
            name: true,
            teamLeader: {
              id: true,
              name: true,
              profile: true,
              contact: true,
              email: true,
            },
          },
          custom: {
            id: true,
            name: true,
            profile: true,
            contact: true,
            email: true,
            designation: true,
          },
          service: {
            id: true,
            name: true,
          },
        },
      },
    });
    return unitInfo;
  }

  update(id: number, updateUnitCoordinatorDto: UpdateUnitCoordinatorDto) {
    return `This action updates a #${id} unitCoordinator`;
  }

  remove(id: number) {
    return `This action removes a #${id} unitCoordinator`;
  }
}
