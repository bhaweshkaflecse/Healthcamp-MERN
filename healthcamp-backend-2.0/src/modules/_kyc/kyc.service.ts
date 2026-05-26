import { Injectable } from '@nestjs/common';
import { CreateKycDto } from './dto/create-kyc.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { kycEntity } from 'src/model/sql/kyc.entity';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, authDocument } from 'src/model/mongo/auth.schema';
import { Model } from 'mongoose';
import { kycStatus } from 'src/helper/types/index.type';
import { rejectCommentDto } from './dto/create-kycComment.dto';
import { kycDocumentEntity } from 'src/model/sql/kycDocument.entity';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(kycEntity)
    private kycRepository: Repository<kycEntity>,

    @InjectRepository(kycDocumentEntity)
    private kycDocumentRepository: Repository<kycDocumentEntity>,

    @InjectModel(Auth.name)
    private authModel: Model<authDocument>,
  ) { }

  async addKycDocument(id: string, document: string) {
    const doc = this.kycDocumentRepository.create({
      kyc: { client: { id } },
      document: document,
    });
    await this.kycDocumentRepository.save(doc);
    return true;
  }

  async create(body: CreateKycDto, clientId: string, documents: string[]) {
    const kyc = await this.kycRepository.findOne({
      where: { client: { id: clientId } },
    });

    kyc.kycStatus = kycStatus.pending;
    kyc.province = body.province;
    kyc.documentType = body.documentType;
    kyc.streetAddress = body.streetAddress;
    kyc.city = body.city;
    kyc.district = body.district;

    const kycDocuments = documents?.map((document) => {
      return this.kycDocumentRepository.create({
        kyc: kyc,
        document: document,
      });
    });
    await this.kycDocumentRepository.save(kycDocuments);
    await this.kycRepository.save(kyc);
    return true;
  }

  async updateKyc(body: CreateKycDto, clientId: string, documents: string[]) {
    const kyc = await this.kycRepository.findOne({
      where: { client: { id: clientId } },
    });

    kyc.kycStatus = kycStatus.pending;
    kyc.province = body.province;
    kyc.documentType = body.documentType;
    kyc.streetAddress = body.streetAddress;
    kyc.city = body.city;
    kyc.district = body.district;
    kyc.comment=null;

    await this.kycDocumentRepository.delete({kyc:{id:kyc.id}});

    const kycDocuments = documents?.map((document) => {
      return this.kycDocumentRepository.create({
        kyc: kyc,
        document: document,
      });
    });
    await this.kycDocumentRepository.save(kycDocuments);
    await this.kycRepository.save(kyc);
    return true;
  }


  async updateKycDocument(id: string, document: string) {
    await this.kycDocumentRepository.update({ id }, { document });
    return true;
  }

  async findOne(id: string) {
    const kyc = await this.kycRepository.findOne({
      where: { client: { id } },
      relations: ['kycDocument']
    });
    return kyc;
  }

  async verifyKyc(id: string) {
    const kyc = await this.kycRepository.findOne({ where: { client: { id } } });
    kyc.kycStatus = kycStatus.approved;
    kyc.comment = null;
    await this.kycRepository.save(kyc);
    return true;
  }

  async rejectKyc(kycRejectCommentDto: rejectCommentDto, id: string) {
    const kyc = await this.kycRepository.findOne({ where: { client: { id } } });
    kyc.kycStatus = kycStatus.reject;
    kyc.comment = kycRejectCommentDto.comment;
    await this.kycRepository.save(kyc);
    return true;
  }

  async remove(id: string) {
    const kyc = await this.kycRepository.findOne({ where: { id } });
    await this.kycRepository.remove(kyc);
    return true;
  }

  async removeDocument(id: string) {
    await this.kycDocumentRepository.delete({ id });
    return true;
  }
}
