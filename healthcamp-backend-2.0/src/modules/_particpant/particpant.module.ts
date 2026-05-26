import { Module } from '@nestjs/common';
import { ParticpantService } from './particpant.service';
import { ParticpantController } from './particpant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { participantEntity } from 'src/model/sql/participant.entity';
import { UploadService } from 'src/helper/utils/files_upload';
import { samplePatientFileEntity } from 'src/model/sql/samplePatient.entity';
import { eventEntity } from 'src/model/sql/event.entity';
import { clientEntity } from 'src/model/sql/client.entity';

@Module({
  imports:[TypeOrmModule.forFeature([participantEntity,samplePatientFileEntity,eventEntity,clientEntity])],
  controllers: [ParticpantController],
  providers: [ParticpantService,UploadService],
})
export class ParticpantModule {}
