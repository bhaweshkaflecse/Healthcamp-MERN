import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { bookingEntity } from 'src/model/sql/booking.entity';
import { eventCalendarEntity } from 'src/model/sql/eventCalendar.entity';
import { calenderEntity } from 'src/model/sql/serviceCalender.entity';
import { clientEntity } from 'src/model/sql/client.entity';
import { bookingDateEntity } from 'src/model/sql/booking_date.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([bookingEntity, eventCalendarEntity,bookingDateEntity, clientEntity]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule { }
