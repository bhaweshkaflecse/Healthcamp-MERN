import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingDate, CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import {
  bookingStatus,
  eventStatus,
  reportPublishType,
  roleType,
} from 'src/helper/types/index.type';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { rejectCommentDto } from '../_kyc/dto/create-kycComment.dto';
import { query } from 'express';

@Controller('booking')
@ApiTags('Book the event')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(roleType.client)
  @ApiOperation({ summary: 'Book the event' })
  bookTheEvent(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    // console.log(createBookingDto)
    const { user } = req;
    return this.bookingService.bookTheEvent(createBookingDto, user);
  }

  @Get('by-status/:enrollId')
  @ApiQuery({ name: 'serviceID' })
  @ApiQuery({ name: 'status', enum: bookingStatus })
  @UseGuards(AtGuard)
  @Roles(roleType.client)
  @ApiBearerAuth('access-token')
  getClientBooking(
    @Param('enrollId') enrollId: string,
    @Req() req,
    @Query('serviceID', ParseUUIDPipe) service,
    @Query('status') status: bookingStatus,
  ) {
    const { user } = req;
    return this.bookingService.getClientBooking(
      enrollId,
      user,
      service,
      status,
    );
  }

  @Get('get-all-booking')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'pageSize', type: 'number' })
  @ApiQuery({ name: 'status', enum: eventStatus })
  @ApiOperation({ summary: "get teamlead's all booked event of clients" })
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(roleType.teamLead)
  getAllBooking(
    @Req() req,
    @Query() paginationDto: PaginationDto,
    @Query('status') status: bookingStatus,
  ) {
    const { user } = req;
    return this.bookingService.getAllBooking(user, paginationDto, status);
  }

  @Get('all-booking')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'pageSize', type: 'number' })
  @ApiOperation({ summary: 'get all booked event of clients' })
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard)
  @Roles(roleType.teamLead)
  getBooking(@Req() req, @Query() paginationDto: PaginationDto) {
    const { user } = req;
    return this.bookingService.getBooking(user, paginationDto);
  }

  @Get('client')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'pageSize', type: 'number' })
  @Roles(roleType.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all booked event of teamlead clients' })
  findBookedEvent(@Req() req: any, @Query() paginationDto: PaginationDto) {
    return this.bookingService.findBookedEvent(req.user.sub, paginationDto);
  }

  @Get('client-booking')
  @Roles(roleType.client)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all booking event of clients ' })
  findClientBookedEvent(@Req() req: any) {
    return this.bookingService.findClientBookedEvent(req.user.sub);
  }

  @Get('event-client')
  @Roles(roleType.client)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'status', enum: eventStatus })
  @ApiOperation({ summary: 'upcoming event for client' })
  clientBookedEvent(@Req() req: any, @Query() query: { status: eventStatus }) {
    const clientId = req.user.sub;
    return this.bookingService.clientBookedEvent(clientId, query.status);
  }

  @Get('upcoming-event')
  @Roles(roleType.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  upcomingEvent(@Req() req: any) {
    return this.bookingService.upcomingEvent(req.user.sub);
  }

  @Get('completed-event')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'pageSize', type: 'number' })
  @Roles(roleType.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  completedEvent(@Req() req: any, @Query() paginationDto: PaginationDto) {
    return this.bookingService.completedEvent(req.user.sub, paginationDto);
  }

  @Get('event-data-entry')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'pageSize', type: 'number' })
  @ApiQuery({ name: 'status', enum:reportPublishType })
  @Roles(roleType.dataEntry)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  completedEventDataEntry(@Req() req: any,@Query() query:{status:reportPublishType}, @Query() paginationDto: PaginationDto) {
    return this.bookingService.completedEventDataEntry( query.status,req.user.sub, paginationDto);
  }
  

  // @Get('report-forwarded-event')
  // @ApiQuery({ name: 'page', type: 'number' })
  // @ApiQuery({ name: 'pageSize', type: 'number' })
  // @Roles(roleType.teamLead)
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiBearerAuth('access-token')
  // forwardedEventReport(@Req() req: any, @Query() paginationDto: PaginationDto) {
  //   return this.bookingService.forwardedEventReport(
  //     req.user.sub,
  //     paginationDto,
  //   );
  // }

  // @Get('client-forwarded-event-report')
  // @Roles(roleType.client)
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiBearerAuth('access-token')
  // clientForwardedEventReport(@Req() req: any) {
  //   return this.bookingService.clientForwardedEventReport(
  //     req.user.sub,
  //   );
  // }

  @Get('report-published-event')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'pageSize', type: 'number' })
  @ApiQuery({ name: 'publish', type:"boolean" })
  @Roles(roleType.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  reportPublishedEvent(@Req() req: any,@Query() query:{publish:boolean}, @Query() paginationDto: PaginationDto) {
    const publish=query.publish;
    return this.bookingService.reportPublishedEvents(
      publish,
      req.user.sub,
      paginationDto,
    );
  }

  @Get('client-report-forwarded-event')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'pageSize', type: 'number' })
  @Roles(roleType.client)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  reportForwardedEvent(@Req() req: any, @Query() paginationDto: PaginationDto) {
    return this.bookingService.reportForwardedEvent(
      req.user.sub,
      paginationDto,
    );
  }

  @Get('event-participant/:bookingId')
  bookingEventParticipant(@Param('bookingId', ParseUUIDPipe) bookingId: string){
    return this.bookingService.bookingEventParticipant(bookingId);
  }


  

  @Get('event-date/:id')
  @Roles(roleType.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findEventBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.findEventBooking(id);
  }

  @Get('event/:id')
  @ApiOperation({ summary: 'get assigned subteam of event' })
  findBookingEvent(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.findBookingEvent(id);
  }

  @Get(':id')
  @Roles(roleType.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.findBooking(id);
  }

  @Patch('accept/:id')
  @Roles(roleType.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  acceptBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.acceptBooking(id);
  }

  @Patch('reject/:id')
  @Roles(roleType.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: rejectCommentDto })
  rejectBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() commentDto: rejectCommentDto,
  ) {
    return this.bookingService.rejectBooking(id, commentDto);
  }

  @Patch('/:id')
  updateBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() bookingDate: BookingDate,
  ) {
    return this.bookingService.updateBooking(id, bookingDate);
  }
}
