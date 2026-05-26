import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { packageEntity } from 'src/model/sql/package.entity';
import { clientEntity } from 'src/model/sql/client.entity';
import { eventEntity } from 'src/model/sql/event.entity';
import { enrollEntity } from 'src/model/sql/enrollment.entity';
import { bookingEntity } from 'src/model/sql/booking.entity';
import { bookingDateEntity } from 'src/model/sql/booking_date.entity';
import { paymentEntity } from 'src/model/sql/payment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([packageEntity,clientEntity,eventEntity,enrollEntity,bookingEntity,bookingDateEntity,paymentEntity])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
