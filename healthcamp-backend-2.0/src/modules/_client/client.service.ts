import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { clientEntity } from 'src/model/sql/client.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, authDocument } from 'src/model/mongo/auth.schema';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { kycEntity } from 'src/model/sql/kyc.entity';
import { hash } from 'src/helper/utils/hash';
import { AuthService } from '../_auth/auth.service';
import { kycStatus, paymentStatus } from 'src/helper/types/index.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { purchasePackageEntity } from 'src/model/sql/purchasePackage.entity';
import { CreatePurchasePackageDto } from './dto/create-purchasePackage.dto';
import * as Redis from 'ioredis';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Injectable()
export class ClientService {
  private redisClient: Redis.Redis;

  constructor(
    @InjectRepository(clientEntity)
    private clientRepository: Repository<clientEntity>,

    @InjectRepository(kycEntity)
    private kycRepository: Repository<kycEntity>,

    @InjectRepository(purchasePackageEntity)
    private purchasePackageRepository: Repository<purchasePackageEntity>,

    @InjectModel(Auth.name)
    private authModel: Model<authDocument>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    private dataSource: DataSource,
    private hash: hash,
    private readonly authService: AuthService,
  ) {}

  async register(createClientDto: CreateClientDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingPhone = await this.clientRepository.findOne({
        where: { contact: createClientDto.contact },
      });

      if (existingPhone) {
        throw new ForbiddenException('Contact number already exists.');
      }

      const existingEmail = await this.clientRepository.findOne({
        where: { email: createClientDto.email },
      });

      if (existingEmail) {
        throw new ForbiddenException('Email already exists.');
      }
      const client = new clientEntity();
      client.id = await this.generedClientId();
      client.name = createClientDto.name;
      client.email = createClientDto.email;
      client.contact = createClientDto.contact;
      client.address = createClientDto.address;
      client.primaryLevelParticipant = createClientDto.primaryLevelParticipant;
      client.midLevelParticipant = createClientDto.midLevelParticipant;
      client.higherLevelParticipant = createClientDto.higherLevelParticipant;
      await queryRunner.manager.save(client);

      const clientAuth = new this.authModel();
      clientAuth.password = await this.hash.value(createClientDto.password);
      clientAuth.userID = client.id;
      await clientAuth.save();

      const clientKyc = new kycEntity();
      clientKyc.name = createClientDto.name;
      clientKyc.email = createClientDto.email;
      clientKyc.contact = createClientDto.contact;
      clientKyc.client = client;
      await queryRunner.manager.save(clientKyc);

      const otpKey = `otp:${createClientDto.email}`;
      await this.cacheManager.del(otpKey);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();

      throw new ForbiddenException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async generedClientId(): Promise<string | any> {
    const lastClient = await this.clientRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    });
    const nextId = lastClient
      ? String(parseInt(lastClient.id, 10) + 1).padStart(5, '0')
      : '00001';
    return nextId;
  }

  async findAll(page: number, perPage: number) {
    const [clients, total] = await this.clientRepository.findAndCount({
      where: [
        // { kyc: { kycStatus: null } },
      ],
      relations: ['kyc', 'teamLead', 'enroll.package'],
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        profile: true,
        address: true,
        createdAt: true,
        kyc: {
          id: true,
          kycStatus: true,
        },
        teamLead: {
          id: true,
          name: true,
        },
        enroll: {
          id: true,
          package: {
            id: true,
            name: true,
          },
        },
      },
      skip: (page - 1) * perPage,
      take: perPage,
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      clients,
      total,
      page,
      perPage,
    };
  }

  async findNewRegister(id: string) {
    const client = await this.clientRepository.find({
      where: {
        teamLead: { team: { id } },
        kyc: { kycStatus: IsNull() },
      },
    });
    return client;
  }

  async findClientByKycStatus(status: kycStatus) {
    const clients = await this.clientRepository.find({
      relations: ['kyc'],
      where: { kyc: { kycStatus: status } },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        kyc: {
          kycStatus: true,
        },
      },
    });
    return clients;
  }

  async findByTeamLead(id: string, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [clients, total] = await this.clientRepository.findAndCount({
      where: { teamLead: { id } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['kyc'],
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
        contact: true,
        kyc: {
          id: true,
          kycStatus: true,
        },
      },
    });
    return {
      clients,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
    return await this.clientRepository.findOne({
      where: { id },
      relations: ['kyc.kycDocument', 'teamLead'],
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        address: true,
        profile: true,
        kyc: {
          id: true,
          province: true,
          streetAddress: true,
          city: true,
          kycStatus: true,
          documentType: true,
          kycDocument: {
            id: true,
            document: true,
          },
        },
        teamLead: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findByEmail(body) {
    const { email } = body;
    const client = await this.clientRepository.findOne({ where: { email } });
    // console.log(client);
    return { success: client ? true : false };
  }

  async updateProfile(id: string, profile: string): Promise<boolean> {
    const client = await this.clientRepository.findOne({ where: { id } });
    client.profile = profile;
    await this.clientRepository.save(client);
    return true;
  }

  async assignTeamLead(id: string, teamLeadId: string): Promise<boolean> {
    await this.clientRepository.update(
      { id },
      { teamLead: { id: teamLeadId } },
    );
    return true;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const transaction = await this.dataSource.transaction(async () => {
      const client = await this.clientRepository.findOne({
        where: { id },
        relations: ['kyc'],
      });
      const updatedClient = Object.assign(client, updateClientDto);
      Object.assign(client.kyc, updateClientDto);
      await this.kycRepository.save(client.kyc);
      await this.clientRepository.save(updatedClient);
      return true;
    });
    // const keys = await this.redisClient.keys("/api/v1/client?");
    // console.log(keys);
    // console.log();
    return transaction;
  }

  async updatePassword(createPasswordResetDto: any) {
    const { email, password, otp } = createPasswordResetDto;
    const existingData: { email: string; otp: string; createdAt: string } =
      await this.cacheManager.get(`otp:${email}`);
    const adminAuth = await this.authModel.findOne({
      email: existingData.email,
    });
    const isVerified = await this.authService.veriyOTP(email, otp);
    if (!isVerified) {
      throw new ForbiddenException('invalid OTP');
    }
    adminAuth.password = await this.hash.value(password);
    await adminAuth.save();
    return { success: true, msg: 'Password updated' };
  }

  async remove(id: string) {
    const client = await this.clientRepository.findOne({ where: { id } });
    await this.clientRepository.remove(client);
    await this.authModel.deleteOne({ userID: id });
    return { success: true, msg: 'Client deleted' };
  }

  async purchasePackage(
    createPurchasePackageDto: CreatePurchasePackageDto,
    id: string,
    proof: string,
    clientId: string,
  ) {
    const purchasePackage = this.purchasePackageRepository.create({
      ...createPurchasePackageDto,
      client: { id: clientId },
      price: { id },
      paymentProof: proof,
    });
    await this.purchasePackageRepository.save(purchasePackage);
    return true;
  }

  async updatePayment(id: string) {
    const purchasePacakge = await this.purchasePackageRepository.findOne({
      where: { id },
    });
    purchasePacakge.paymentStatus = paymentStatus.approved;
    await this.purchasePackageRepository.save(purchasePacakge);
    return true;
  }

  async getClintInfo(id: string) {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['kyc.kycDocument', 'teamLead'],
      select: {
        id: true,
        email: true,
        name: true,
        profile: true,
        address: true,
        contact: true,
        kyc: {
          id: true,
          province: true,
          city: true,
          streetAddress: true,
          kycStatus: true,
          comment:true,
          documentType: true,
          kycDocument: {
            id: true,
            document: true,
          },
        },
        teamLead: {
          name: true,
          profile: true,
          email: true,
          contact: true,
        },
      },
    });
    return client;
  }
}
