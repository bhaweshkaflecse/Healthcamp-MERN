import { Module } from '@nestjs/common';
import { SubteamService } from './subteam.service';
import { SubteamController } from './subteam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { subTeamEntity } from 'src/model/sql/subTeam.entity';
import { adminEntity } from 'src/model/sql/admin.entity';
import { customEntity } from 'src/model/sql/customMember.entity';
import { teamEntity } from 'src/model/sql/team.entity';

@Module({
  imports:[TypeOrmModule.forFeature([subTeamEntity,adminEntity,customEntity,teamEntity])],
  controllers: [SubteamController],
  providers: [SubteamService],
})
export class SubteamModule {}
