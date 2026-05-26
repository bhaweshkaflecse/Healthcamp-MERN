import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Banner, bannerDocument } from 'src/model/mongo/banner.schema';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name)
    private bannerModel: Model<bannerDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(img: string): Promise<bannerDocument> {
    try {
      const authSchema = new this.bannerModel();
      authSchema.img = img;
      this.cacheManager.del("/api/v1/banner")
      return await authSchema.save();
    } catch (e) {
      throw e;
    }
  }

  async findAll(): Promise<bannerDocument[]> {
    try {
      return this.bannerModel.find().exec();
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<Boolean> {
    try {
      const bannerIndex = await this.bannerModel.findOne({ _id: id });
      if (!bannerIndex) {
        throw new NotFoundException(`Banner not found`);
      }
      await this.bannerModel.deleteOne({ _id: id }).exec();
      this.cacheManager.del("/api/v1/banner")
      return true
    } catch (error) {
      throw error;
    }
  }
}