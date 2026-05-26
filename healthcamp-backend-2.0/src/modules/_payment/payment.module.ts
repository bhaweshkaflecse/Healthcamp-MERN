import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { UploadService } from 'src/helper/utils/files_upload';
import { TypeOrmModule } from '@nestjs/typeorm';
import { paymentEntity } from 'src/model/sql/payment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([paymentEntity])],
  controllers: [PaymentController],
  providers: [PaymentService,UploadService],
})
export class PaymentModule {}
