import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { paymentEntity } from 'src/model/sql/payment.entity';
import { Repository } from 'typeorm';
import { paymentStatus } from 'src/helper/types/index.type';
import { rejectCommentDto } from '../_kyc/dto/create-kycComment.dto';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(paymentEntity)
    private readonly paymentRepository: Repository<paymentEntity>,
  ) {}
  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  async findHistory(id: string, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [paymentHistory, total] = await this.paymentRepository.findAndCount({
      where: { paymentVerifyBy: { id } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { paymentHistory, total, page, pageSize };
  }

  async findPaymentLog(paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [paymentHistory,total] = await this.paymentRepository.findAndCount({
      relations: ['enroll.client', 'enroll.package'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        status: true,
        price: true,
        medium: true,
        createdAt: true,
        comment: true,
        enroll: {
          id: true,
          client: {
            id: true,
            name: true,
          },
          package: {
            id: true,
            name: true,
          },
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return {paymentHistory,total,page,pageSize};
  }

  async findPackageBought(paginationDto:PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [paymentHistory,total] = await this.paymentRepository.findAndCount({
      where: {
        status: paymentStatus.approved,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['enroll.client', 'enroll.package'],
      select: {
        id: true,
        status: true,
        price: true,
        medium: true,
        createdAt: true,
        comment: true,
        enroll: {
          id: true,
          client: {
            id: true,
            name: true,
          },
          package: {
            id: true,
            name: true,
          },
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return {paymentHistory,total,page,pageSize};
  }

  async findAll() {
    const payments = await this.paymentRepository.find({
      where: { status: paymentStatus.pending },
      relations: ['enroll', 'enroll.client', 'enroll.package'],
      select: {
        id: true,
        price: true,
        medium: true,
        updatedAt: true,
        status: true,
        enroll: {
          id: true,
          client: {
            id: true,
            name: true,
            profile: true,
          },
          package: {
            id: true,
            name: true,
          },
        },
      },
    });
    // console.log(payments);

    return payments;
  }

  async findApprovedPayment(id: string,paginationDto:PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [paymentHistory,total] = await this.paymentRepository.findAndCount({
      where: {
        status: paymentStatus.approved,
        paymentVerifyBy: { id },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      // relations:['enroll.client'],
      order: {
        createdAt: 'ASC',
      },
      select: {
        id: true,
        price: true,
        proof: true,
        status: true,
        updatedAt: true,
      },
    });
    return {paymentHistory,total,page,pageSize};
  }

  async findOne(id: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['enroll.package', 'enroll.client'],
      select: {
        id: true,
        price: true,
        proof: true,
        medium: true,
        status: true,
        updatedAt: true,
        enroll: {
          id: true,
          client: {
            id: true,
            name: true,
            profile: true,
          },
          package: {
            id: true,
            name: true,
          },
        },
      },
    });
    return payment;
  }

  async updatePayment(
    id: string,
    proof: string,
    updatePaymentDto: UpdatePaymentDto,
  ) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    payment.proof = proof;
    payment.updatedAt = new Date();
    payment.status = paymentStatus.pending;
    const updatedPayment = Object.assign(payment, updatePaymentDto);
    await this.paymentRepository.save(updatedPayment);
    return true;
  }

  async verifyPayment(id: string, financeAdminId: string) {
    await this.paymentRepository.update(
      { id },
      {
        status: paymentStatus.approved,
        paymentVerifyBy: { id: financeAdminId },
      },
    );

    return true;
  }

  async rejectPayment(
    id: string,
    financeAdminId: string,
    body: rejectCommentDto,
  ) {
    await this.paymentRepository.update(
      { id },
      {
        status: paymentStatus.reject,
        comment: body.comment,
        paymentVerifyBy: { id: financeAdminId },
      },
    );
    return true;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
