import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateParticpantDto } from './dto/create-particpant.dto';
import { UpdateParticpantDto } from './dto/update-particpant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { participantEntity } from 'src/model/sql/participant.entity';
import { EntityManager, In, Not, Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';
import { eventEntity } from 'src/model/sql/event.entity';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { clientEntity } from 'src/model/sql/client.entity';

@Injectable()
export class ParticpantService {
  constructor(
    @InjectRepository(participantEntity)
    private readonly participantRepository: Repository<participantEntity>,

    @InjectRepository(eventEntity)
    private readonly eventRepository: Repository<eventEntity>,

    @InjectRepository(clientEntity)
    private readonly clientRepository: Repository<clientEntity>,
  ) { }
  // async bulkUploadParticipant(
  //   participants,
  //   clientId: string,
  //   manager: EntityManager,
  // ) {
  //   const insertedParticipants = [];

  //   try {
  //     const client = await this.clientRepository.findOne({
  //       where: { id: clientId },
  //       relations: ['kyc'],
  //     });

  //     if (!client) {
  //       throw new BadRequestException(`Client with ID ${clientId} not found.`);
  //     }
  //     if (!(await client).kyc) {
  //       throw new ForbiddenException("KYC is not approved.")
  //     }

  //     await manager.transaction(async (transactionalEntityManager) => {
  //       let errCount = 0;
  //       const newParticipants = [];
  //       const validData = [];
  //       // console.log("THere are participant: ", participants.length)
  //       const uniqueId = await this.generateStudentId(client);
  //       for (const row of participants) {
  //         // console.log(participants.indexOf(row));
  //         // console.log(uniqueId);
  //         // console.log(parseInt(uniqueId.nextID.replace(uniqueId.prefix, '')));
  //         // console.log(parseInt(participants.indexOf(row)));
  //         const uniqueIDOfParticipant = uniqueId.prefix + ((parseInt(uniqueId.nextID.replace(uniqueId.prefix, '')) + parseInt(participants.indexOf(row))) - errCount).toString();
  //         // return
  //         const participantDto = plainToInstance(CreateParticpantDto, row);
  //         const errors = validateSync(participantDto);

  //         if (errors.length > 0) {
  //           console.warn(
  //             `Skipping participant due to validation errors: ${errors}`,
  //           );
  //           continue; // Skip invalid participant but process others
  //         }

  //         const existingParticipant = await transactionalEntityManager.findOne(
  //           participantEntity,
  //           {
  //             where: { name: row.name, contact: row.phone },
  //           },
  //         );
  //         if (existingParticipant) {
  //           console.log(row);
  //           errCount = errCount + 1;
  //           continue;
  //         }
  //         if (validData.map((item) => {
  //           if (item.name == row.name && item.phone == row.phone) {
  //             errCount = errCount + 1;
  //             // continue;
  //           }
  //         }))

  //           if (!existingParticipant) {
  //             validData.push(row);
  //             const newParticipant = new participantEntity();
  //             newParticipant.id = uniqueIDOfParticipant;
  //             newParticipant.email = row.email;
  //             newParticipant.name = row.name;
  //             newParticipant.grade = row.grade;
  //             newParticipant.address = row.address;
  //             newParticipant.contact = row.phone;
  //             newParticipant.gender = row.gender;
  //             newParticipant.client = client;

  //             newParticipants.push(newParticipant);
  //           }
  //       }

  //       if (newParticipants.length > 0) {
  //         const savedParticipants =
  //           await transactionalEntityManager.save(newParticipants);
  //         insertedParticipants.push(...savedParticipants);
  //       }
  //     });

  //     return insertedParticipants;
  //   } catch (err) {
  //     console.error(err);
  //     throw new InternalServerErrorException(
  //       `Error in bulk upload: ${err.message}`,
  //     );
  //   }
  // }

  async bulkUploadParticipant(
    participants,
    clientId: string,
    manager: EntityManager,
  ) {
    const insertedParticipants = [];

    try {
      const client = await this.clientRepository.findOne({
        where: { id: clientId },
        relations: ['kyc'],
      });

      if (!client) {
        throw new BadRequestException(`Client with ID ${clientId} not found.`);
      }
      if (!client.kyc) {
        throw new ForbiddenException("KYC is not approved.")
      }

      await manager.transaction(async (transactionalEntityManager) => {
        // Get the ID generation info once
        const idInfo = await this.generateStudentId(client);
        console.log(idInfo);
        let nextNumber = idInfo.nextNumber;
        const prefix = idInfo.prefix;

        const newParticipants = [];
        const validData = [];

        // First pass: validate and collect unique participants
        for (const row of participants) {
          const participantDto = plainToInstance(CreateParticpantDto, row);
          const errors = validateSync(participantDto);

          if (errors.length > 0) {
            console.warn(
              `Skipping participant due to validation errors: ${errors}`,
            );
            continue;
          }

          // Check for duplicates in database
          const existingParticipant = await transactionalEntityManager.findOne(
            participantEntity,
            {
              where: { name: row.name, contact: row.phone, client: { id: clientId } },
            },
          );

          if (existingParticipant) {
            // console.log(`Skipping existing participant: ${row.name}`);
            continue;
          }

          // Check for duplicates in current batch
          const isDuplicate = validData.some(
            item => item.name === row.name && item.phone === row.phone
          );

          if (isDuplicate) {
            // console.log(`Skipping duplicate in batch: ${row.name}`);
            continue;
          }

          // Add to valid data
          validData.push(row);
        }
        // Second pass: create participant entities with sequential IDs
        for (const row of validData) {
          const newParticipant = new participantEntity();
          newParticipant.id = `${prefix}${nextNumber}`;
          nextNumber++; // Increment for next participant

          newParticipant.email = row.email;
          newParticipant.name = row.name;
          newParticipant.grade = row.grade;
          newParticipant.address = row.address;
          newParticipant.contact = row.phone;
          newParticipant.gender = row.gender;
          newParticipant.client = client;

          newParticipants.push(newParticipant);
        }

        if (newParticipants.length > 0) {
          const savedParticipants =
            await transactionalEntityManager.save(newParticipants);
          insertedParticipants.push(...savedParticipants);
        }
      });

      return insertedParticipants;
    } catch (err) {
      // console.error(err);
      throw new InternalServerErrorException(
        `Error in bulk upload: ${err.message}`,
      );
    }
  }


  async addParticipantEvent(id: string, participantIds: string[]) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['participants'],
    });
    // console.log(event);
    if (
      event.participant - (event.participants.length + participantIds.length) <
      0
    ) {
      throw new ForbiddenException(
        `You can only add ${event.participant} participant.`,
      );
    }

    participantIds.map((id) => {
      const isExistParticipant = event.participants.some(
        (participant) => participant.id === id,
      );

      !isExistParticipant &&
        event.participants.push({ id } as participantEntity);
    });
    await this.eventRepository.save(event);
    return true;
  }

  async getSampleFileToUploadParticipant(res) {
    const filePath = path.join(
      __dirname,
      '../../../download/sample-participant-upload.xls',
    );
    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('File not found');
    }
    res.download(filePath, 'sample-participant-upload.xls', (err) => {
      if (err) {
        throw new InternalServerErrorException(err.message);
      }
    });
  }

  async getAllParticipantInSpreadsheet(clientId: string, res) {
    const participants = await this.participantRepository.find({
      where: { client: { id: clientId } },
    });

    const worksheet = XLSX.utils.json_to_sheet(participants);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="participants.xlsx"',
    );

    res.send(buffer);
  }

  async getIfParticipantExistInEvent(eventId: string, participantId: string) {
    const existingEvent = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['participants'],
    });
    console.log(existingEvent)
    if (!existingEvent) {
      throw new NotFoundException('Invalid event ID');
    }
    if (!existingEvent.participant) {
      throw new NotFoundException("Participant doesn't exist")
    }
    const participants = existingEvent.participants;
    const participant = participants.find(
      (participant) => participant.id === participantId,
    );
    return participant;
  }

  async create(createParticpantDto: CreateParticpantDto, id: string) {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['kyc'],
    });
    console.log(client)
    const isExistParticipant = await this.participantRepository.findOne({
      where: {
        contact: createParticpantDto.phone,
        name: createParticpantDto.name
      }
    })
    console.log(isExistParticipant)
    if (isExistParticipant) {
      throw new BadRequestException("Participant with same name and number can't be created. It already exist in database.")
    }
    if (!(client).kyc) {
      throw new ForbiddenException("KYC is not approved.")
    }
    const uniqueId = await this.generateStudentId(client);
    // console.log(uniqueId.nextNumber+ " is unique id")
    const { phone, ...body } = createParticpantDto;
    const participant = this.participantRepository.create({
      ...body,
      contact: phone,
      client: { id },
      id: uniqueId.nextID,
    });
    await this.participantRepository.save(participant);
    return true;
  }

  // async generateStudentId(school: clientEntity): Promise<any> {
  //   if (!school) throw new InternalServerErrorException('School not found');
  //   const prefix =
  //     school.id +
  //     school.kyc.province.substring(0, 2).toUpperCase() +
  //     school.kyc.district.substring(0, 3).toUpperCase() +
  //     school.name.substring(0, 3).toUpperCase();
  //   const lastStudent = await this.participantRepository.findOne({
  //     where: { client: { id: school.id } },
  //     order: { createdAt: 'DESC' },
  //   });
  //   let nextNumber = 1;
  //   if (lastStudent) {
  //     const lastId = lastStudent.id.replace(prefix, '');
  //     const lastNumber = parseInt(lastId, 10);
  //     nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
  //   }
  //   return {
  //     nextID: `${prefix}${nextNumber}`,
  //     prefix: prefix,
  //     nextNumber: nextNumber
  //   };
  // }

  async generateStudentId(school: clientEntity): Promise<any> {
    if (!school) throw new InternalServerErrorException('School not found');

    const prefix =
      school.id +
      school.kyc.province.substring(0, 2).toUpperCase() +
      school.kyc.district.substring(0, 3).toUpperCase() +
      school.name.substring(0, 3).toUpperCase();

    // Query to find the highest numeric part of the ID
    const result = await this.participantRepository.createQueryBuilder('participant')
      .where('participant.client = :schoolId', { schoolId: school.id })
      .andWhere('participant.id LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('LENGTH(participant.id)', 'DESC')
      .addOrderBy('participant.id', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (result) {
      const lastId = result.id.replace(prefix, '');
      const lastNumber = parseInt(lastId, 10);
      nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
    }

    return {
      nextID: `${prefix}${nextNumber}`,
      prefix: prefix,
      nextNumber: nextNumber
    };
  }

  async getAllParticipantInEvent(eventid: string, clientId: string) {
    const participantCount = await this.participantRepository.count({
      where: { client: { id: clientId } },
    });
    // console.log(participantCount);
    const eventDetails = await this.eventRepository.find({
      where: { id: eventid },
      relations: ['participants'],
    });
    // console.log(eventDetails);
    return { eventDetails, participantCount };
  }

  async uploadFile(file: any, id: string) {
    const parsedFile = parseFileToJson(file.buffer, file.originalname);
    const participantEmail = await this.participantRepository.find({
      where: { client: { id } },
      select: ['email'],
    });
    const emailList = participantEmail.map((participant) => participant.email);
    const existEmail = [];
    const participants = parsedFile
      .map((participant) => {
        if (!emailList.includes(participant.email)) {
          const newParticipant = this.participantRepository.create({
            ...participant,
            client: { id },
          });
          return newParticipant;
        } else {
          existEmail.push(participant.email);
        }
        return null;
      })
      .filter((participant) => participant !== null);
    await this.participantRepository.save(participants);
    return existEmail.length == 0
      ? { success: true, msg: 'uploaded' }
      : {
        success: true,
        msg: 'duplicated email are not uploaded',
        emails: existEmail,
      };
  }

  async findAll(id: string) {
    const participants = await this.participantRepository.find({
      where: { client: { id } },
    });
    return participants;
  }

  async findAllUniqueParticipantOfEvent(eventId: string, clientId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['participants'],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const enrolledParticipantIds = event.participants.map(participant => participant.id);
    const uniqueParticipants = await this.participantRepository.find({
      where: {
        client: { id: clientId },
        id: Not(In(enrolledParticipantIds))
      },
    });
    return uniqueParticipants;
  }

  async findByGrade(id: string, grade: number) {
    const participant = await this.participantRepository.find({
      where: { client: { id }, grade },
    });
    return participant;
  }

  async findByNameParticipantId(
    id: string,
    name: string,
    participantId: string,
  ) {
    const participant = await this.participantRepository.find({
      where: {
        client: { id },
        // name: name&&ILike(%${name}%),
        id: participantId && participantId,
      },
    });
    // console.log(participant);
    return participant;
  }

  async findOne(id: string) {
    const participant = await this.participantRepository.findOne({
      where: { id },
    });
    return participant;
  }

  async update(id: string, updateParticpantDto: UpdateParticpantDto) {
    const participant = await this.participantRepository.findOne({
      where: { id },
    });
    if (!participant) {
      throw new BadRequestException('Participant not found');
    }
    const updatedParticipant = Object.assign(participant, updateParticpantDto);
    await this.participantRepository.save(updatedParticipant);
    return true;
  }

  async updateGrade(id: string, grade: number, updated_grade: number) {
    await this.participantRepository.update(
      { client: { id }, grade },
      { grade: updated_grade },
    );
    return true;
  }

  async remove(id: string) {
    const participant = await this.participantRepository.findOne({
      where: { id },
    });

    await this.participantRepository.remove(participant);
    return true;
  }

  async getParticipantOfEvent(id: string) {
    const eventDetails = await this.eventRepository.find({
      where: { id },
    });
    return eventDetails[0].participants;
  }

  async eventParticipant(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['participants'],
    });
    return event;
  }

  async findEnrollmentParticipant(eventIds: string[]) {
    // const { eventIds } = eventListDto;
    const participants = await Promise.all(
      eventIds.map(async (id) => {
        const event = await this.eventRepository.findOne({
          where: { id },
          relations: ['participants', 'participants.forwardReport'],
        });
        return event.participants
      }),
    );

    const uniqueParticipants = Array.from(
      new Map(
        participants.flat().map((participant) => [participant.id, participant])
      ).values()
    );
    const all = [...participants].flat();
    // console.log(all.length, uniqueParticipants.length)
    return uniqueParticipants;
  }
}

function parseExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
}

function parseCsv(buffer) {
  const csvString = buffer.toString();
  return parse(csvString, { columns: true, skip_empty_lines: true });
}

function parseFileToJson(buffer, filename) {
  const fileExtension = filename.split('.').pop().toLowerCase();
  switch (fileExtension) {
    case 'xlsx':
    case 'xls':
      return parseExcel(buffer);
    case 'csv':
      return parseCsv(buffer);
    default:
      throw new Error('Unsupported file format');
  }
}
