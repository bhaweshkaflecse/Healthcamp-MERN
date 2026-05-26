import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AddMemberDto, CreateChangeTeamDto } from './dto/change-team.dto';
import { query } from 'express';
import { deptType, roleType as role, roleType } from 'src/helper/types/index.type';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';

@Controller('team')
@ApiTags("Team")
// @UseInterceptors(CacheInterceptor)
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Post()
  @Roles(role.businessHead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: "Create Team" })
  createTeam(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Post('member-add/:id')
  @Roles(roleType.teamLead, roleType.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  memberAdd(@Param('id', ParseUUIDPipe) id: string, @Body() AddMemberDto: AddMemberDto) {
    return this.teamService.addMember(id, AddMemberDto);
  }

  @Get()
  @ApiOperation({ summary: "find all teams" })
  findAll() {
    return this.teamService.findAll();
  }

  @Get('find-by-leader')
  @ApiOperation({ summary: "Find one team" })
  @ApiQuery({ name: 'teamLeader' })
  findByLeader(@Query() query: { teamLeader: string }) {
    const { teamLeader } = query;
    return this.teamService.findByTeamLeader(teamLeader);
  }

  @Get('info')
  @ApiOperation({ summary: "Find one team" })
  @Roles(roleType.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findTeam(@Req() req: any) {
    const teamLeaderId = req.user.sub;
    return this.teamService.findTeam(teamLeaderId);
  }

  @Get('member-by-role/:id')
  @ApiOperation({ summary: "Find team member by role" })
  @ApiQuery({ name: 'role', enum: deptType })
  findByRole(@Param('id', ParseUUIDPipe) id: string, @Query() query: { role: deptType }) {
    const { role } = query;
    return this.teamService.findMemberByRole(id, role);
  }

  @Get('member-by-team/:id')
  @ApiOperation({ summary: "Find team member by role" })
  findMemberByTeam(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.findMemberByTeam(id)
  }

  @Get('info/:id')
  @ApiOperation({ summary: "Find one team" })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.findTeam(id);
  }

  @Get(':id')
  @ApiOperation({ summary: "Find one team" })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.findOne(id);
  }


  @Patch('member-change')
  @Roles(role.businessHead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  changeTeam(@Body() createChangeTeamDto: CreateChangeTeamDto) {
    return this.teamService.changeTeam(createChangeTeamDto);
  }

  @Patch('leader-change')
  @ApiQuery({ name: 'teamId' })
  @ApiQuery({ name: 'teamLeaderId' })
  @Roles(role.businessHead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  changeLeader(@Query() query: { teamId: string, teamLeaderId: string }) {
    const { teamId, teamLeaderId } = query;
    return this.teamService.changeLeader(teamId, teamLeaderId);
  }

  @Patch(':id')
  @Roles(roleType.businessHead, roleType.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Update team" })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete('member-remove')
  @Roles(roleType.teamLead, roleType.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'teamId' })
  @ApiQuery({ name: 'adminId' })
  memberDelete(@Query() query: { teamId: string, adminId: string }) {
    const { teamId, adminId } = query;
    return this.teamService.removeMember(teamId, adminId);
  }

  @Delete('leader-remove/:teamId')
  @Roles(roleType.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  leaderDelete(@Param('teamId', ParseUUIDPipe) teamId: string) {
    return this.teamService.removeLeader(teamId);
  }

  @Delete(':id')
  @Roles(roleType.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "delete team" })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.remove(id);
  }

}
