import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enrollEntity } from 'src/model/sql/enrollment.entity';
import { paymentEntity } from 'src/model/sql/payment.entity';
import { UploadService } from 'src/helper/utils/files_upload';
import { packageEntity } from 'src/model/sql/package.entity';
import { ParticpantService } from '../_particpant/particpant.service';
import { participantEntity } from 'src/model/sql/participant.entity';
import { eventEntity } from 'src/model/sql/event.entity';
import { clientEntity } from 'src/model/sql/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([enrollEntity, paymentEntity, packageEntity,participantEntity,eventEntity,clientEntity])],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, UploadService,ParticpantService],
})
export class EnrollmentModule { }
