import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseArrayPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SubteamService } from './subteam.service';
import { CreateSubteamDto } from './dto/create-subteam.dto';
import { UpdateSubteamDto } from './dto/update-subteam.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { query } from 'express';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { roleType as role, roleType } from 'src/helper/types/index.type';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Controller('subteam')
@ApiTags('Sub Team')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class SubteamController {
  constructor(private readonly subteamService: SubteamService) { }

  @Post('add-custom-member')
  @Roles(roleType.teamLead, roleType.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add Custom Member' })
  @ApiQuery({ name: 'subTeamId' })
  @ApiQuery({ name: 'customId' })
  addCustom(@Query() query: { subTeamId: string; customId: string }) {
    const { subTeamId, customId } = query;
    return this.subteamService.addCustom(subTeamId, customId);
  }

  @Post('add-member')
  @Roles(roleType.teamLead, roleType.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add Custom Member' })
  @ApiQuery({ name: 'subTeamId' })
  @ApiQuery({ name: 'memberId' })
  addMember(@Query() query: { subTeamId: string; memberId: string }) {
    const { subTeamId, memberId } = query;
    return this.subteamService.addMember(subTeamId, memberId);
  }

  @Post(':id')
  @Roles(role.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create Sub Team' })
  create(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createSubteamDto: CreateSubteamDto,
  ) {
    // console.log('dto:', createSubteamDto);
    return this.subteamService.create(id, createSubteamDto);
  }

  @Get('by-team-service')
  @ApiOperation({ summary: 'Create Sub Team' })
  @ApiQuery({ name: 'teamId' })
  @ApiQuery({ name: 'serviceId' })
  findAllByService(@Query() query: { teamId: string; serviceId: string }) {
    const { teamId, serviceId } = query;
    return this.subteamService.findAllByService(teamId, serviceId);
  }

  @Get('find-by-service/:id')
  @ApiOperation({ summary: 'find subteams by service' })
  subteamByService(@Param('id', ParseUUIDPipe) id: string) {
    return this.subteamService.subteamByService(id);
  }

  @Get('find-by-team-service/:serviceId')
  @Roles(role.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findByTeam(
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Req() req: any,
  ) {
    const teamLeadId = req.user.sub;
    return this.subteamService.findByTeam(teamLeadId, serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Create Sub Team' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.subteamService.findOne(id);
  }

  @Patch(':id')
  @Roles(roleType.teamLead, roleType.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateSubteamDto })
  @ApiOperation({ summary: 'Update Sub Team' })
  update(@Param('id') id: string, @Body() updateSubteamDto: UpdateSubteamDto) {
    return this.subteamService.update(id, updateSubteamDto);
  }

  @Delete('delete-member')
  @Roles(roleType.teamLead, roleType.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Dele4000te Sub Team' })
  @ApiQuery({ name: 'subTeamId' })
  @ApiQuery({ name: 'memberId' })
  removeMember(@Query() query: { subTeamId: string; memberId: string }) {
    const { subTeamId, memberId } = query;
    return this.subteamService.removeMember(subTeamId, memberId);
  }

  @Delete(':id')
  @Roles(roleType.teamLead, roleType.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete Sub Team' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subteamService.remove(id);
  }
}
