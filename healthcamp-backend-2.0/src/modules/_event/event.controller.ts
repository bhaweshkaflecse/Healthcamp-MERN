import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
  AssignSubteamDto,
  CreateEventDto,
  EventFeedbackDto,
} from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import {
  eventStatus,
  reportPublishType,
  roleType as role,
} from 'src/helper/types/index.type';
import { query } from 'express';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Controller('event')
@ApiTags('Event')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post('subteam-assign')
  @Roles(role.unitCoordinator, role.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'bookDateId' })
  @ApiQuery({ name: 'subTeamId' })
  subTeamAssign(@Query() query: { bookDateId: string; subTeamId: string }) {
    const { bookDateId, subTeamId } = query;
    return this.eventService.subTeamAssign(bookDateId, subTeamId);
  }

  @Post('feedback/:id')
  eventFeedback(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() eventFeedbackDto: EventFeedbackDto,
  ) {
    return this.eventService.eventFeedback(id, eventFeedbackDto);
  }

  @Post('assign-subteam/:id')
  @Roles(role.unitCoordinator, role.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'submit assign to the event' })
  assignSubteam(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignSubteamDto: AssignSubteamDto,
  ) {
    return this.eventService.assignSubteam(id, assignSubteamDto);
  }

  @Get('upcoming')
  @Roles(role.unitCoordinator)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'upcoming event for unit coordinator' })
  upcomingEvent(@Req() req: any) {
    const unitId = req.user.sub;
    return this.eventService.upcomingEvent(unitId);
  }

  @Get('complete')
  @Roles(role.unitCoordinator)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'complete event for unit coordinator' })
  completedEvent(@Req() req: any) {
    const unitId = req.user.sub;
    return this.eventService.completedEvent(unitId);
  }

  @Get('completed')
  findCompleted(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const perPageNumber = parseInt(perPage) || 10;
    return this.eventService.findCompleted(pageNumber, perPageNumber);
  }

  @Get('to-assign-report')
  @ApiQuery({ name: "page", type: "number" })
  @ApiQuery({ name: "pageSize", type: "number" })
  // @Roles(role.dataEntry)
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiQuery({ name: 'reportPublish' ,enum:reportPublishType })
  // @ApiBearerAuth('access-token')
  eventToAssignReport(@Query() paginationDto: PaginationDto) {
    return this.eventService.eventToAssignReport(paginationDto);
  }

  @Get('subteam/:id')
  findSubteam(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.findSubteam(id);
  }

  @Get('completed-info/:id')
  getCompletedInfo(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.getCompletedInfo(id);
  }

  @Get('participant-subteam/:id')
  @ApiQuery({ name: 'subTeamId' })
  findEventParticipant(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: { subTeamId: string },
  ) {
    return this.eventService.findEventParticipant(id, query.subTeamId);
  }

  @Get('service/:serviceId')
  // @ApiQuery({ name: 'year' })
  // @ApiQuery({ name: 'month' })
  findEventService(
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    // @Query() query: { year:number,month:number},
  ) {
    return this.eventService.findEventService(serviceId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.findOne(id);
  }

  @Patch('change-subteam/:eventSubteamId')
  @Roles(role.unitCoordinator, role.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'change subteam' })
  @ApiQuery({ name: 'subteamId' })
  changeSubTeam(
    @Param('eventSubteamId', ParseUUIDPipe) eventSubteamId: string,
    @Query() query: { subteamId: string },
  ) {
    const { subteamId } = query;
    return this.eventService.changeSubTeam(eventSubteamId, subteamId);
  }

  @Patch('update-status/:eventId')
  @Roles(role.unitCoordinator, role.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update event status' })
  @ApiQuery({ name: 'status', enum: eventStatus })
  updateEventStatus(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Query() query: { status: eventStatus },
  ) {
    const { status } = query;
    return this.eventService.updateEventStatus(eventId, status);
  }

  @Patch('/:eventId')
  @Roles(role.unitCoordinator, role.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update event participant' })
  update(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(eventId, updateEventDto);
  }
}
