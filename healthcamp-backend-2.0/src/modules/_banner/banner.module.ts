import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { UploadService } from 'src/helper/utils/files_upload';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, bannerSchema } from 'src/model/mongo/banner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banner.name, schema: bannerSchema },
    ]),
  ],
  controllers: [BannerController],
  providers: [BannerService, UploadService],
})
export class BannerModule { }
