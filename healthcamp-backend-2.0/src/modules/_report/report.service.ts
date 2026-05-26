import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { ReportEntity } from 'src/model/sql/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeEntity } from 'src/model/sql/attribute.entity';
import { serviceEntity } from 'src/model/sql/service.entity';
import { participantEntity } from 'src/model/sql/participant.entity';
import * as JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import jsPDF from 'jspdf';
import { eventEntity } from 'src/model/sql/event.entity';
import {
  CreateEntryReportDto,
  CreateForwardReportDto,
  CreateReportDto,
  CreateResultDto,
  GetparticipantReportDto,
  GetReportDto,
} from './dto/report.dto';
import { ResultEntity } from 'src/model/sql/result.entity';
import {
  bookingStatus,
  eventStatus,
  reportForwardBy,
  reportForwardStatus,
  reportPublishType,
} from 'src/helper/types/index.type';
import { trackParticipantReportEntity } from 'src/model/sql/trackReport.entity';
import { sendMail } from 'src/config/mail.config';
import { ForwardReportEntity } from 'src/model/sql/forwardReport.entity';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { bookingEntity } from 'src/model/sql/booking.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,

    @InjectRepository(eventEntity)
    private readonly eventRepository: Repository<eventEntity>,

    @InjectRepository(serviceEntity)
    private readonly serviceRepository: Repository<serviceEntity>,

    @InjectRepository(participantEntity)
    private readonly participantRepository: Repository<participantEntity>,

    @InjectRepository(ResultEntity)
    private readonly resultRepository: Repository<ResultEntity>,

    @InjectRepository(ForwardReportEntity)
    private readonly forwardReportRepository: Repository<ForwardReportEntity>,

    @InjectRepository(trackParticipantReportEntity)
    private readonly trackReportRepository: Repository<trackParticipantReportEntity>,

    @InjectRepository(bookingEntity)
    private readonly bookingRepository: Repository<bookingEntity>,
  ) {}

  async getParticipantDetails(participantId: string) {
    console.log(participantId);
    return this.participantRepository.findOne({
      where: { id: participantId },
    });
  }

  async generateBarCode(participantIds: string[]) {
    try {
      const participants = await this.participantRepository.find({
        where: { id: In(participantIds) },
      });

      if (!participants || participants.length === 0) {
        throw new BadRequestException('No participants found');
      }

      const doc = new jsPDF();
      let y = 10;
      let x = 10;

      for (const participant of participants) {
        const canvas = createCanvas(200, 100);
        JsBarcode(canvas, participant.id.toString(), {
          format: 'CODE128',
          width: 2,
          height: 50,
          displayValue: true,
          textMargin: 5,
        });

        const imgData = canvas.toDataURL('image/jpeg');

        doc.addImage(imgData, 'JPEG', x, y, 60, 30);
        x += 65;
        if (x > 140) {
          x = 10;
          y += 45;
        }

        if (y > 280) {
          doc.addPage();
          y = 10;
          x = 10;
        }
      }

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      return pdfBuffer;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error generating barcode');
    }
  }

  async entryReport(body: CreateEntryReportDto, reportId: string) {
    const results = await Promise.all(
      body.report.map(async (entryReportDto) => {
        const { value, attributeId, participantId } = entryReportDto;
        console.log(entryReportDto);
        const existingResult = await this.resultRepository.findOne({
          where: {
            participant: { id: participantId },
            report: { id: reportId },
            attribute: { id: attributeId },
          },
        });
        if (existingResult)
          throw new ForbiddenException('This participant is already exist.');

        if (!existingResult) {
          const resultEntity = new ResultEntity();
          resultEntity.value = value;
          resultEntity.report = { id: reportId } as ReportEntity;
          resultEntity.attribute = { id: attributeId } as AttributeEntity;
          resultEntity.participant = { id: participantId } as participantEntity;
          return resultEntity;
        }

        return null;
      }),
    );

    const filteredResults = results.filter((result) => result !== null);

    if (filteredResults.length > 0) {
      await this.resultRepository.save(filteredResults);
      await this.trackReport(body?.report[0].participantId, reportId);
    }

    return true;
  }

  async isReportPublished(body: CreateReportDto) {
    const existingReport = await this.reportRepository.findOne({
      where: {
        event: { id: body.eventId },
        service: { id: body.serviceId },
      },
    });
    if (!existingReport) {
      return {
        published: false,
        report: null,
      };
    }
    return { published: true, report: existingReport.id };
  }

  async getAllServiceOfEvent(id: string) {
    const events = await this.eventRepository.find({
      where: { id },
      relations: ['bookingDate.booking.enrollPackage.package.service'],
      order: {
        createdAt: 'ASC',
      },
      select: {
        id: true,
        reportPublishType: true,
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
                service: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    });
    // console.log(events);
    return events;
  }

  async getAllAttributesOfService(serviceId: string) {
    const existingAttribute = await this.serviceRepository.findOne({
      where: { id: serviceId },
      relations: ['attributes'],
    });
    // console.log(existingAttribute);
    if (!existingAttribute) {
      throw new BadRequestException('Service not found');
    }
    return existingAttribute;
  }

  async getAllParticipantofReport(body: GetReportDto) {
    const list = await this.reportRepository.find({
      where: {
        service: {
          id: body.serviceId,
        },
        event: {
          id: body.eventId,
        },
      },
      relations: ['results', 'results.participant'],
    });
    console.log(list);
    if (list.length <= 0) {
      return [];
    }
    const participantIds = list[0].results.map((item) => item.participant.id);
    const unique = new Set(participantIds);
    return this.participantRepository.find({
      where: { id: In(Array.from(unique)) },
    });
  }

  async participantofReport(eventId: string) {
    const participants = await this.resultRepository.find({
      where: { report: { event: { id: eventId } } },
      relations: ['participant'],
    });
    return participants;
  }

  async getReportOfParticipantById(reportId: string, participantId: string) {
    const existingResult = await this.resultRepository.find({
      where: {
        report: { id: reportId },
        participant: { id: participantId },
      },
      relations: ['attribute'],
    });
    if (!existingResult) {
      throw new BadRequestException('Result not found');
    }
    return existingResult;
  }

  async getParticipantOfReport(
    id: string,
    paginationDto: PaginationDto,
    status: reportForwardStatus,
  ) {
    const { page, pageSize } = paginationDto;
    const [report, total] = await this.trackReportRepository.findAndCount({
      where: {
        report: { id },
        reportForwardStatus: status ? status : reportForwardStatus.false,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['participant'],
      select: {
        id: true,
        reportForwardStatus: true,
        participant: {
          id: true,
          name: true,
          gender: true,
          grade: true,
          address: true,
          email: true,
          contact: true,
        },
      },
    });
    return { report, total, page, pageSize };
  }

  async publishReport(reportId: string) {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
      relations: ['event.bookingDate.booking', 'trackReport'],
    });
    if (report?.event?.participant != report?.trackReport.length) {
      throw new ForbiddenException("Please fill all participant's report.");
    }
    await this.eventRepository.update(
      { id: report?.event?.id },
      { reportPublishType: reportPublishType.published },
    );

    const bookingId = report?.event?.bookingDate?.booking.id;
    const booking = await this.bookingRepository.findOne({
      where: {
        id: bookingId,
      },
      relations: ['bookingDates.event'],
    });
    const totalPublishedEvent = await this.eventRepository.count({
      where: {
        status: eventStatus.completed,
        reportPublishType: reportPublishType.published,
        bookingDate: { booking: { id: bookingId } },
      },
    });

    if (totalPublishedEvent == booking?.bookingDates.length) {
      await this.bookingRepository.update(
        { id: bookingId },
        { status: bookingStatus.completed },
      );
    }
    return true;
  }

  async updateReportStatus(id: string, status: reportPublishType) {
    const response = await this.eventRepository.update(
      { id },
      { reportPublishType: status },
    );

    return response.affected > 0 ? true : false;
  }

  async updateResult(id: string, createResultDto: CreateResultDto) {
    const { value } = createResultDto;
    await this.resultRepository.update({ id }, { value });
    return true;
  }

  async trackReport(participantId: string, reportId: string) {
    const existingTrack = await this.trackReportRepository.findOne({
      where: {
        participant: { id: participantId },
        report: { id: reportId },
      },
    });
    if (!existingTrack) {
      const newTrackReport = this.trackReportRepository.create({
        report: { id: reportId },
        participant: { id: participantId },
      });
      await this.trackReportRepository.save(newTrackReport);
    }
    return true;
  }

  async trackParticipantReport(id: string, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const reports = await this.trackReportRepository.find({
      where: {
        report: { event: { bookingDate: { booking: { client: { id } } } } },
      },
      relations: ['participant'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        reportForwardStatus: true,
        createdAt: true,
        participant: {
          id: true,
          name: true,
          gender: true,
          email: true,
          contact: true,
          grade: true,
          address: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return reports;
  }

  async forwardParticipantReport(
    id: string,
    createForwardReportDto: CreateForwardReportDto,
  ) {
    const { participantIds } = createForwardReportDto;

    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['bookingDates.event.report'],
      select: {
        id: true,
        bookingDates: {
          id: true,
          event: {
            id: true,
            report: {
              id: true,
            },
          },
        },
      },
    });

    const reportIds = booking.bookingDates
      .map((date) => date?.event?.report?.id)
      .filter(Boolean);

    if (!reportIds.length || !participantIds.length) return;

    await this.trackReportRepository
      .createQueryBuilder()
      .update()
      .set({ reportForwardStatus: reportForwardStatus.true })
      .where('reportId IN (:...reportIds)', { reportIds })
      .andWhere('participantId IN (:...participantIds)', { participantIds })
      .execute();

    return true;
  }

  async forwardParticipantMergedReport(
    id: string,
    createForwardReportDto: CreateForwardReportDto,
  ) {
    const { participantIds } = createForwardReportDto;

    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['bookingDates.event.report'],
      select: {
        id: true,
        bookingDates: {
          id: true,
          event: {
            id: true,
            report: {
              id: true,
            },
          },
        },
      },
    });

    return booking

    const reportIds = booking.bookingDates
      .map((date) => date?.event?.report?.id)
      .filter(Boolean);
      
      const results = await this.resultRepository
      .createQueryBuilder('result')
      .leftJoinAndSelect('result.report', 'report')
      .leftJoinAndSelect('report.service', 'service')
      .leftJoinAndSelect('result.attribute', 'attribute')
      .leftJoinAndSelect('result.participant', 'participant')
      .where('report.id IN (:...reportIds)', { reportIds })
      .andWhere('participant.id IN (:...participantIds)', { participantIds }) // Optional: only selected participants
      .getMany();
    
      const groupedByParticipant: Record<string, {
        participant: any;
        results: {
          attribute: string;
          value: string;
          report: {
            id: string;
            serviceName: string;
          };
        }[];
      }> = {};
      
      for (const result of results) {
        const pid = result.participant.id;
      
        if (!groupedByParticipant[pid]) {
          groupedByParticipant[pid] = {
            participant: result.participant,
            results: [],
          };
        }
      
        groupedByParticipant[pid].results.push({
          attribute: result.attribute.name,
          value: result.value,
          report: {
            id: result.report.id,
            serviceName: result.report.service?.name,
          },
        });
      }
      
   return groupedByParticipant;
  }

  async forwardAllParticipantMergedReport(id: string) {
    const eventsReport = await this.reportRepository.find({
      where: { event: { bookingDate: { booking: { id } } } },
      relations: ['service', 'results.participant', 'results.attribute'],
      select: {
        id: true,
        service: {
          id: true,
          name: true,
        },
        results: {
          id: true,
          value: true,
          attribute: {
            id: true,
            name: true,
          },
          participant: {
            id: true,
            name: true,
            contact: true,
            email: true,
          },
        },
      },
    });

    const groupedByParticipant = {};

    eventsReport.forEach((item) => {
      const { service } = item;

      item.results.forEach((result) => {
        const participantId = result.participant.id;

        if (!groupedByParticipant[participantId]) {
          groupedByParticipant[participantId] = {
            participant: result.participant,
            results: [],
          };
        }

        groupedByParticipant[participantId].results.push({
          resultId: result.id,
          value: result.value,
          attribute: result.attribute,
          service,
        });
      });
    });

    const groupedArray = Object.values(groupedByParticipant);
    return groupedArray;
  }

  async getParticipantMergedReport(id: string, participantId: string) {
    const eventsReport = await this.reportRepository.find({
      where: {
        event: { bookingDate: { booking: { id } } },
        results: { participant: { id: participantId } },
      },
      relations: ['service', 'results.participant', 'results.attribute'],
      select: {
        id: true,
        service: {
          id: true,
          name: true,
        },
        results: {
          id: true,
          value: true,
          attribute: {
            id: true,
            name: true,
          },
          participant: {
            id: true,
            name: true,
            contact: true,
            email: true,
          },
        },
      },
    });

    const groupedByParticipant = {};

    eventsReport.forEach((item) => {
      const { service } = item;

      item.results.forEach((result) => {
        const participantId = result.participant.id;

        if (!groupedByParticipant[participantId]) {
          groupedByParticipant[participantId] = {
            participant: result.participant,
            results: [],
          };
        }

        groupedByParticipant[participantId].results.push({
          resultId: result.id,
          value: result.value,
          attribute: result.attribute,
          service,
        });
      });
    });

    const groupedArray = Object.values(groupedByParticipant);
    return groupedArray;
  }

 
async  forwardByTeam(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id,
        status: bookingStatus.completed,
      },
      relations: ['bookingDates.event.report'],
    });
    booking?.bookingDates.map(async (bookingDate) => {
      await this.eventRepository.update(
        { id: bookingDate?.event.id },
        { reportForwardBy: reportForwardBy.teamLead },
      );
    });

    return true;
  }

  async reportForward(id: string, body: CreateForwardReportDto) {
    const { participantIds } = body;

    const participantReport = await Promise.all(
      participantIds.map(async (participant) => {
        const isExist = await this.forwardReportRepository.findOne({
          where: { enrollment: { id }, participant: { id: participant } },
        });

        if (!isExist) {
          return this.forwardReportRepository.create({
            enrollment: { id },
            isForward: reportForwardStatus.true,
            participant: { id: participant },
          });
        }
        return null;
      }),
    );

    const validReports = participantReport.filter((report) => report !== null);

    if (validReports.length > 0) {
      await this.forwardReportRepository.save(validReports);
    }

    return true;
  }

  async reportByStatus(id: string, status: reportForwardStatus) {
    const reports = await this.reportRepository.findOne({
      where: { id, trackReport: { reportForwardStatus: status } },
      relations: ['trackReport'],
    });
    return reports;
  }

  async deleteResult(getparticipantReportDto: GetparticipantReportDto) {
    const { participantId, reportId } = getparticipantReportDto;
    const results = await this.resultRepository.find({
      where: { participant: { id: participantId }, report: { id: reportId } },
    });
    if (results.length === 0) {
      return false;
    }
    const track_report = await this.trackReportRepository.findOne({
      where: {
        participant: { id: participantId },
        report: { id: reportId },
      },
    });
    await this.trackReportRepository.remove(track_report);
    await this.resultRepository.remove(results);
    return true;
  }

  async totalParticipantReportEntry(id: string) {
    const result = await this.resultRepository.find({
      where: { report: { id } },
      relations: ['participant'],
      select: {
        id: true,
        participant: {
          id: true,
        },
      },
    });
    const uniqueClients = Array.from(
      new Map(result?.map((item) => [item.participant.id, item])).values(),
    );
    return { reportCount: uniqueClients?.length };
  }
}
