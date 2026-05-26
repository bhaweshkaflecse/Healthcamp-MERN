import { Module, forwardRef } from '@nestjs/common';
import { CalenderService } from './calender.service';
import { CalenderController } from './calender.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { serviceEntity } from 'src/model/sql/service.entity';
import { calenderEntity } from 'src/model/sql/serviceCalender.entity';
import { dateSlotEntity } from 'src/model/sql/dateSlot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([serviceEntity, calenderEntity, dateSlotEntity]),
  ],
  controllers: [CalenderController],
  exports: [CalenderService],
  providers: [
    CalenderService
  ],
})
export class CalenderModule { }
