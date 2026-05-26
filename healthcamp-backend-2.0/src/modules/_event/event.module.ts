import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { eventEntity } from 'src/model/sql/event.entity';
import { eventSubteamEntity } from 'src/model/sql/eventSubteam.entity';
import { eventFeedbackEntity } from 'src/model/sql/eventFeedback.entity';
import { bookingEntity } from 'src/model/sql/booking.entity';
import { eventCalendarEntity } from 'src/model/sql/eventCalendar.entity';
import { bookingDateEntity } from 'src/model/sql/booking_date.entity';
import { subTeamEntity } from 'src/model/sql/subTeam.entity';
import { ReportEntity } from 'src/model/sql/report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      eventEntity,
      eventSubteamEntity,
      eventFeedbackEntity,
      bookingEntity,
      bookingDateEntity,
      eventCalendarEntity,
      subTeamEntity,
      ReportEntity,
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
