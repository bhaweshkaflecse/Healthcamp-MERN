import { Module } from '@nestjs/common';
import { CustomMemberService } from './custom_member.service';
import { CustomMemberController } from './custom_member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { customEntity } from 'src/model/sql/customMember.entity';
import { subTeamEntity } from 'src/model/sql/subTeam.entity';
import { UploadService } from 'src/helper/utils/files_upload';

@Module({
  imports:[TypeOrmModule.forFeature([customEntity,subTeamEntity])],
  controllers: [CustomMemberController],
  providers: [CustomMemberService,UploadService],
})
export class CustomMemberModule {}
