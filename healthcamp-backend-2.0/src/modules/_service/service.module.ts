import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { serviceEntity } from 'src/model/sql/service.entity';
import { AttributeEntity } from 'src/model/sql/attribute.entity';
import { packageEntity } from 'src/model/sql/package.entity';
import { calenderEntity } from 'src/model/sql/serviceCalender.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([serviceEntity, AttributeEntity, packageEntity, calenderEntity]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule { }
