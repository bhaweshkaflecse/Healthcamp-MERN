import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { packageEntity } from 'src/model/sql/package.entity';
import { priceEntity } from 'src/model/sql/price.entity';
import { serviceEntity } from 'src/model/sql/service.entity';
import { UploadService } from 'src/helper/utils/files_upload';

@Module({
  imports: [
    TypeOrmModule.forFeature([packageEntity, priceEntity, serviceEntity]),
  ],
  controllers: [PackageController],
  providers: [PackageService, UploadService],
})
export class PackageModule { }
