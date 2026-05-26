import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { hash } from 'src/helper/utils/hash';
import { Token } from 'src/helper/utils/token';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, authSchema } from 'src/model/mongo/auth.schema';
import { adminEntity } from 'src/model/sql/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtStrategy } from 'src/middlewares/access_token/at.strategy';
import { RtStrategy } from 'src/middlewares/refresh_token/rt.strategy';
import { clientEntity } from 'src/model/sql/client.entity';
import { MainSeeder } from 'src/model/seeds/main.seeder';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Auth.name, schema: authSchema },
    ]),
    TypeOrmModule.forFeature([adminEntity,clientEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, Token, hash, AtStrategy, RtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
