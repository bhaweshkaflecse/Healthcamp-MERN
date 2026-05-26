import { Module } from '@nestjs/common';
import { CallCentreService } from './call_centre.service';
import { CallCentreController } from './call_centre.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inquery, inquerySchema } from 'src/model/mongo/inquery.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Inquery.name, schema: inquerySchema },
    ]),
  ],
  controllers: [CallCentreController],
  providers: [CallCentreService],
})
export class CallCentreModule {}
