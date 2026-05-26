import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInqueryDto } from './dto/create-call_centre.dto';
import { UpdateCallCentreDto } from './dto/update-call_centre.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquery, inqueryDocument } from 'src/model/mongo/inquery.schema';
import { callReasonType, callType } from 'src/helper/types/index.type';

@Injectable()
export class CallCentreService {
  constructor(
    @InjectModel(Inquery.name)
    private inqueryModel: Model<inqueryDocument>,
  ) { }
  async create(createInqueryDto: CreateInqueryDto) {
    const { name, contact, description, callType, reason } = createInqueryDto;
    const inquery = new this.inqueryModel();
    inquery.name = name;
    inquery.contact = contact;
    inquery.description = description ? description : "";
    inquery.callType = callType
    inquery.reason = reason;
    await inquery.save();
    return true;
  }

  async findAll(page: number, limit: number, status?: callType, reason?: callReasonType) {
    const filter: any = {};

    if (status) filter.callType = status;
    if (reason) filter.reason = reason;

    const count = await this.inqueryModel.countDocuments(filter).exec();
    const page_total = Math.floor((count - 1) / limit) + 1;
    const skip = limit * (page - 1);

    const data = await this.inqueryModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    return {
      data: data,
      page_total: page_total,
    };
  }


  async findOne(id: string) {
    return await this.inqueryModel.findById({ _id: id });
  }

  async update(id: string, updateCallCentreDto: UpdateCallCentreDto) {
    const existingLog = await this.inqueryModel.findOne({ _id: id }).exec();
    existingLog.name = updateCallCentreDto.name;
    existingLog.contact = updateCallCentreDto.contact;
    existingLog.callType = updateCallCentreDto.callType
    await existingLog.save()
  }

  async remove(id: string) {
    const isExist = await this.findOne(id)
    if (!isExist) throw new NotFoundException('Inquery not found')
    await this.inqueryModel.deleteOne({ _id: id }).exec();
    return true;
  }
}