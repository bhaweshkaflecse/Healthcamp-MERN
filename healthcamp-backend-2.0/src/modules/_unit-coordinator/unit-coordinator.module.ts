import { Module } from '@nestjs/common';
import { UnitCoordinatorService } from './unit-coordinator.service';
import { UnitCoordinatorController } from './unit-coordinator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { eventEntity } from 'src/model/sql/event.entity';
import { serviceEntity } from 'src/model/sql/service.entity';
import { adminEntity } from 'src/model/sql/admin.entity';

@Module({
  imports:[TypeOrmModule.forFeature([eventEntity,serviceEntity,adminEntity])],
  controllers: [UnitCoordinatorController],
  providers: [UnitCoordinatorService],
})
export class UnitCoordinatorModule {}
