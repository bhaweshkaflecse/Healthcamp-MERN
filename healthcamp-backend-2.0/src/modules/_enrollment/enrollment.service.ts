import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { enrollEntity } from 'src/model/sql/enrollment.entity';
import { DataSource, Repository } from 'typeorm';
import { paymentEntity } from 'src/model/sql/payment.entity';
import { bookingStatus, enrollStatus, paymentStatus } from 'src/helper/types/index.type';
import { clientEntity } from 'src/model/sql/client.entity';
import { packageEntity } from 'src/model/sql/package.entity';
import { CreatePaymentDto } from '../_payment/dto/create-payment.dto';
import { rejectCommentDto } from '../_kyc/dto/create-kycComment.dto';
import { ParticpantService } from '../_particpant/particpant.service';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(enrollEntity)
    private readonly enrollRepository: Repository<enrollEntity>,

    @InjectRepository(paymentEntity)
    private readonly paymentRepository: Repository<paymentEntity>,

    @InjectRepository(packageEntity)
    private readonly packageRepository: Repository<packageEntity>,

    private dataSource: DataSource,

    private participantService:ParticpantService
  ) {}

  //   async create(clientId: string, packageId: string, s3response: string, createPaymentDto: CreatePaymentDto) {
  //     const queryRunner = this.dataSource.createQueryRunner();
  //     await queryRunner.connect();
  //     try {
  //       await queryRunner.startTransaction();
  //       const enroll = new enrollEntity();
  //       enroll.client = { id: clientId } as clientEntity;
  //       enroll.package = { id: packageId } as packageEntity;
  //       enroll.status = enrollStatus.pending;
  //       enroll.participant = createPaymentDto.participant;
  //       await queryRunner.manager.save(enroll);

  //     await queryRunner.commitTransaction();
  //     return true;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async create(
    clientId: string,
    packageId: string,
    s3response: string,
    createPaymentDto: CreatePaymentDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const enroll = new enrollEntity();
      enroll.client = { id: clientId } as clientEntity;
      enroll.package = { id: packageId } as packageEntity;
      enroll.status = enrollStatus.pending;
      enroll.participant = createPaymentDto.participant;
      await queryRunner.manager.save(enroll);

      const payment = new paymentEntity();
      payment.enroll = enroll;
      payment.medium = createPaymentDto.medium;
      payment.price = createPaymentDto.price;
      payment.proof = s3response;
      payment.status = paymentStatus.pending;
      await queryRunner.manager.save(payment);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByClientStatus(id: string, status: enrollStatus) {
    const enrollPackage = await this.enrollRepository.find({
      where: {
        status,
        client: { id },
      },
      relations: ['package'],
      select: {
        id: true,
        comment: true,
        status: true,
        package: {
          id: true,
          name: true,
          description: true,
          img: true,
        },
        
      },
    });
    return enrollPackage;
  }

  async findByStatus(status: enrollStatus) {
    const enrollPackage = await this.enrollRepository.find({
      where: { status },
    });
    return enrollPackage;
  }

  async allParticipant(id: string) {
    const events = await this.enrollRepository.findOne({
      where: {
        id,
      },
      relations: ['booking.bookingDates.event'],
    });
    const eventIds = events?.booking?.map((item) =>
      item?.bookingDates?.map((bookingDate) => bookingDate?.event?.id),
    );
    const allEvents=[...eventIds].flat().filter((item) => item != null);
    const particpants=await this.participantService.findEnrollmentParticipant(allEvents);
    return particpants;
    return [...eventIds].flat().filter((item) => item != null);
  }

  async findByTeamlead(id: string, status: enrollStatus) {
    const enrollPackages = await this.enrollRepository.find({
      where: {
        status,
        client: { teamLead: { id } },
      },
      relations: ['client'],
      select: {
        id: true,
        createdAt: true,
        client: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
    return enrollPackages;
  }

  async getEnrollmentByPackage(id: string, teamLeadId: string,paginationDto:PaginationDto) {
    const {page,pageSize}=paginationDto;
    const [enrolls,total] = await this.enrollRepository.findAndCount({
      where: {
        package: { id },
        client: { teamLead: { id: teamLeadId } },
        // status: enrollStatus.pending,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['client'],
      select: {
        id: true,
        createdAt:true,
        client: {
          id: true,
          name: true,
          profile:true,
          email: true,
        },
      },
      order:{
        createdAt:'DESC'
      }
    });
    // console.log(enrolls);
    return {
      enrolls,
      page,
      pageSize,
      total
    };
  }

  async soldPackage(page: number, perPage: number) {
    const [clients, total] = await this.enrollRepository.findAndCount({
      where: { status: enrollStatus.approved },
      select: ['id'],
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return {
      clients,
      total,
      page,
      perPage,
    };
  }

  async findOne(id: string) {
    const enrollPackage = await this.enrollRepository
      .createQueryBuilder('enroll')
      .leftJoinAndSelect('enroll.payment', 'payment')
      .leftJoinAndSelect('payment.paymentVerifyBy', 'paymentVerifyBy')
      .leftJoinAndSelect('enroll.package', 'package')
      .leftJoinAndSelect('enroll.client', 'client')
      .where('enroll.id = :id', { id })
      .select([
        'enroll.id',
        'enroll.participant',
        'payment.id',
        'payment.price',
        'payment.medium',
        'payment.proof',
        'payment.status',
        'paymentVerifyBy.id',
        'paymentVerifyBy.name',
        'package.id',
        'package.name',
        'package.description',
        'package.img',
        'client.id',
        'client.name',
        'client.email',
        'client.profile',
      ])
      .getOne();
    return enrollPackage;
  }

  async verifyPackage(id: string) {
    const packages = await this.enrollRepository.findOne({
      where: { id },
      relations: ['payment'],
      select: {
        payment: {
          status: true,
        },
      },
    });
    if (packages.payment.status !== paymentStatus.approved) {
      throw new ForbiddenException('payment not verified by finance');
    }
    await this.enrollRepository.update(
      { id },
      { status: enrollStatus.approved },
    );
  }

  async rejectPackage(id: string, body: rejectCommentDto) {
    await this.enrollRepository.update(
      { id },
      {
        status: enrollStatus.reject,
        comment: body.comment,
      },
    );
  }

  update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return `This action updates a #${id} enrollment`;
  }

  async remove(id: string): Promise<boolean> {
    await this.enrollRepository.delete({ id });
    return true;
  }

  async getAllEnrollmentByPackage(id: string) {
    const exisistingPackage = await this.packageRepository.findOne({
      where: { id: id },
    });
    if (!exisistingPackage) {
      throw new ForbiddenException('Invalid request');
    }
    const users = await this.enrollRepository.find({
      where: { package: { id } },
      relations: ['client'],
    });
    return users;
  }
}
