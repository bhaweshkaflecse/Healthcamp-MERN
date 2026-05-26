import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/pg.config';
import { redisConfig } from './config/redis.config';
import { mongoConfig } from './config/mongo.config';
import { RedisClientOptions } from 'redis';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { AdminModule } from './modules/_admin/admin.module';
import { AuthModule } from './modules/_auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServiceModule } from './modules/_service/service.module';
import { PackageModule } from './modules/_package/package.module';
import { TeamModule } from './modules/_team/team.module';
import { CustomMemberModule } from './modules/_custom_member/custom_member.module';
import { SubteamModule } from './modules/_subteam/subteam.module';
import { ClientModule } from './modules/_client/client.module';
import { KycModule } from './modules/_kyc/kyc.module';
import { ParticpantModule } from './modules/_particpant/particpant.module';
import { CalenderModule } from './modules/_calender/calender.module';
import { BannerModule } from './modules/_banner/banner.module';
import { EnrollmentModule } from './modules/_enrollment/enrollment.module';
import { PaymentModule } from './modules/_payment/payment.module';
import { CallCentreModule } from './modules/_call_centre/call_centre.module';
import { BookingModule } from './modules/_booking/booking.module';
import { EventModule } from './modules/_event/event.module';
import { ReportModule } from './modules/_report/report.module';
import { DashboardModule } from './modules/_dashboard/dashboard.module';
import { AssignCalendarModule } from './modules/_assign_calendar/_assign_calendar.module';
import { UnitCoordinatorModule } from './modules/_unit-coordinator/unit-coordinator.module';
import { ErrorLoggerMiddleware } from './middlewares/logger/errorLogger.middleware';
import { TicketModule } from './modules/ticket/ticket.module';

const URI = new mongoConfig().URI;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    MongooseModule.forRoot(URI),
    CacheModule.registerAsync<RedisClientOptions>(redisConfig),
    AdminModule,
    BookingModule,
    AuthModule,
    EventModule,
    AuthModule,
    DashboardModule,
    ServiceModule,
    PackageModule,
    TeamModule,
    SubteamModule,
    CustomMemberModule,
    ClientModule,
    KycModule,
    ParticpantModule,
    CalenderModule,
    BannerModule,
    EnrollmentModule,
    PaymentModule,
    CallCentreModule,
    ReportModule,
    AssignCalendarModule,
    UnitCoordinatorModule,
    TicketModule
  ],
  controllers: [AppController],
  providers: [],
})
// export class AppModule { }
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorLoggerMiddleware).forRoutes('*');
  }                             
}

