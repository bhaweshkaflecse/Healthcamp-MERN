import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { clientEntity } from 'src/model/sql/client.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { kycEntity } from 'src/model/sql/kyc.entity';
import { Auth, authSchema } from 'src/model/mongo/auth.schema';
import { hash } from 'src/helper/utils/hash';
import { UploadService } from 'src/helper/utils/files_upload';
import { purchasePackageEntity } from 'src/model/sql/purchasePackage.entity';
import { AuthService } from '../_auth/auth.service';
import { Token } from 'src/helper/utils/token';
import { adminEntity } from 'src/model/sql/admin.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auth.name, schema: authSchema },
    ]),
    TypeOrmModule.forFeature([clientEntity,kycEntity,purchasePackageEntity,adminEntity]),
    JwtModule.register({})
  ],
  controllers: [ClientController],
  providers: [ClientService,hash,UploadService,AuthService,Token],
})
export class ClientModule { }
