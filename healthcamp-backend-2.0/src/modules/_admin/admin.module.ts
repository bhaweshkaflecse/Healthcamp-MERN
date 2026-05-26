import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { adminEntity } from 'src/model/sql/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, authSchema } from 'src/model/mongo/auth.schema';
import { hash } from 'src/helper/utils/hash';
import { UploadService } from 'src/helper/utils/files_upload';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Auth.name, schema: authSchema },
    ]),
    TypeOrmModule.forFeature([adminEntity]),
  ],
  controllers: [AdminController],
  providers: [AdminService, hash,UploadService],
})
export class AdminModule {}
