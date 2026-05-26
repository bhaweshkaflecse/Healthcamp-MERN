import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from 'src/model/sql/report.entity';
import { participantEntity } from 'src/model/sql/participant.entity';
import { serviceEntity } from 'src/model/sql/service.entity';
import { AttributeEntity } from 'src/model/sql/attribute.entity';
import { clientEntity } from 'src/model/sql/client.entity';
import { eventEntity } from 'src/model/sql/event.entity';
import { ResultEntity } from 'src/model/sql/result.entity';
import { trackParticipantReportEntity } from 'src/model/sql/trackReport.entity';
import { ForwardReportEntity } from 'src/model/sql/forwardReport.entity';
import { bookingEntity } from 'src/model/sql/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReportEntity,
      participantEntity,
      serviceEntity,
      ResultEntity,
      clientEntity,
      eventEntity,
      trackParticipantReportEntity,
      ForwardReportEntity,
      bookingEntity
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
