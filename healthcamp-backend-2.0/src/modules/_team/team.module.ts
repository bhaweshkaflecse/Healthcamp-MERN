import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { teamEntity } from 'src/model/sql/team.entity';
import { adminEntity } from 'src/model/sql/admin.entity';
import { subTeamEntity } from 'src/model/sql/subTeam.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([teamEntity, adminEntity,subTeamEntity]),
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule { }
