import { Module } from '@nestjs/common';
import { AssignCalendarService } from './_assign_calendar.service';
import { AssignCalendarController } from './_assign_calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { clientEntity } from 'src/model/sql/client.entity';
import { eventCalendarEntity } from 'src/model/sql/eventCalendar.entity';
import { serviceEntity } from 'src/model/sql/service.entity';
import { calenderEntity } from 'src/model/sql/serviceCalender.entity';
import { packageEntity } from 'src/model/sql/package.entity';
import { bookingEntity } from 'src/model/sql/booking.entity';
import { bookingDateEntity } from 'src/model/sql/booking_date.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([clientEntity, serviceEntity, eventCalendarEntity, calenderEntity, packageEntity, bookingEntity,bookingDateEntity]),
  ],
  controllers: [AssignCalendarController],
  providers: [AssignCalendarService],
})
export class AssignCalendarModule { }