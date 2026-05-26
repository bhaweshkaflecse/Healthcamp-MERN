import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { kycEntity } from 'src/model/sql/kyc.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, authSchema } from 'src/model/mongo/auth.schema';
import { UploadService } from 'src/helper/utils/files_upload';
import { kycDocumentEntity } from 'src/model/sql/kycDocument.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([kycEntity,kycDocumentEntity]),
    MongooseModule.forFeature([
      { name: Auth.name, schema: authSchema }
    ]),
  ],
  controllers: [KycController],
  providers: [KycService,UploadService],
})
export class KycModule {}
