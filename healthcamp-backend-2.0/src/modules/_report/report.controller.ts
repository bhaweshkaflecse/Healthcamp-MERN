import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseUUIDPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { query, Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateEntryReportDto,
  CreateForwardReportDto,
  CreateReportDto,
  CreateResultDto,
  GetparticipantReportDto,
  GetReportDto,
} from './dto/report.dto';
import {
  reportForwardStatus,
  reportPublishType,
  roleType,
} from 'src/helper/types/index.type';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Controller('report')
@ApiTags('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('publish-report/:reportId')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(roleType.dataEntry)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Publish report' })
  async publishReport(@Param('reportId', ParseUUIDPipe) reportId: string) {
    return await this.reportService.publishReport(reportId);
  }

  @Post('entry-report/:reportId')
  @Roles(roleType.dataEntry)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Entry report' })
  async entryReport(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Body() body: CreateEntryReportDto,
  ) {
    return await this.reportService.entryReport(body, reportId);
  }

  @Post('forward-report/:enrollId')
  @Roles(roleType.unitCoordinator)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Entry report' })
  async reportForward(
    @Param('enrollId', ParseUUIDPipe) enrollId: string,
    @Body() createForwardReportDto: CreateForwardReportDto,
  ) {
    return await this.reportService.reportForward(
      enrollId,
      createForwardReportDto,
    );
  }

  @Get('generate-bar-code')
  @ApiOperation({ summary: 'Generate barcodes for participants' })
  @ApiBody({
    description: 'Array of participant IDs for barcode generation',
    type: [String],
  })
  async generateBarCode(
    @Body() participantIds: string[],
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.reportService.generateBarCode(participantIds);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="participant_barcodes.pdf"',
    );
    res.send(pdfBuffer);
  }

  @Get('get-participant-details/:participantId')
  @ApiOperation({ summary: 'Get participant details' })
  async getParticipantDetails(@Param('participantId') participantId: string) {
    return await this.reportService.getParticipantDetails(participantId);
  }

  @Post('is-report-published')
  @ApiOperation({ summary: 'Check if report is published' })
  async isReportPublished(@Body() Body: CreateReportDto) {
    return await this.reportService.isReportPublished(Body);
  }

  @Get('get-all-service-of-event/:eventId')
  @ApiOperation({ summary: 'Get all services of event' })
  async getAllServiceOfEvent(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return await this.reportService.getAllServiceOfEvent(eventId);
  }

  @Get('get-all-attributes-of-service/:serviceId')
  @ApiOperation({ summary: 'Get all attributes of service' })
  async getAllAttributesOfService(
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ) {
    return await this.reportService.getAllAttributesOfService(serviceId);
  }

  @Get('get-all-participants-of-report')
  @ApiOperation({ summary: 'Get all reports' })
  @ApiQuery({ name: 'eventId', type: 'string' })
  @ApiQuery({ name: 'serviceId', type: 'string' })
  async getAllParticipantofReport(@Query() getReportDto: GetReportDto) {
    return await this.reportService.getAllParticipantofReport(getReportDto);
  }

  @Get('participants-of-report')
  @ApiOperation({ summary: 'Get all reports' })
  @ApiQuery({ name: 'eventId', type: 'string' })
  async participantofReport(@Query('eventId') query: { eventId: string }) {
    return await this.reportService.participantofReport(query.eventId);
  }

  @Get('get-report-of-participant')
  @ApiOperation({ summary: 'Get report of participant' })
  @ApiQuery({ name: 'reportId', type: 'string' })
  @ApiQuery({ name: 'participantId', type: 'string' })
  async getReportOfParticipant1(
    @Query() getReportDto: GetparticipantReportDto,
  ) {
    return await this.reportService.getReportOfParticipantById(
      getReportDto.reportId,
      getReportDto.participantId,
    );
  }

  @Get('forward-status/:id')
  @ApiQuery({ name: 'status', enum: reportForwardStatus })
  reportByStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('status') query: { status: reportForwardStatus },
  ) {
    return this.reportService.reportByStatus(id, query.status);
  }

  @Get('track-participant')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'pageSize', type: 'number' })
  @Roles(roleType.client)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  trackParticipantReport(
    @Req() req: any,
    @Query() paginationDto: PaginationDto,
  ) {
    const id = req.user.sub;
    return this.reportService.trackParticipantReport(id, paginationDto);
  }

  @Get('participant/:id')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'pageSize', type: 'number' })
  @ApiQuery({ name: 'status', enum: reportForwardStatus })
  @Roles(roleType.client)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  getParticipantOfReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationDto: PaginationDto,
    @Query() query: { status: reportForwardStatus },
  ) {
    return this.reportService.getParticipantOfReport(
      id,
      paginationDto,
      query.status,
    );
  }

  @Get('total-entry-count/:id')
  totalParticipantReportEntry(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportService.totalParticipantReportEntry(id);
  }

  @Patch('forward-report-by-team/:bookingId')
  // @Roles(roleType.teamLead)
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiBearerAuth('access-token')
  async forwardByTeam(@Param('bookingId', ParseUUIDPipe) bookingId: string) {
    return this.reportService.forwardByTeam(bookingId);
  }

  @Patch('forward-participant-report/:bookingId')
  @Roles(roleType.client)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  async forwardParticipantReport(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() createForwardReportDto: CreateForwardReportDto,
  ) {
    return this.reportService.forwardParticipantReport(
      bookingId,
      createForwardReportDto,
    );
  }

  @Patch('forward-bulk-participant-report/:bookingId')
  // @Roles(roleType.client)
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiBearerAuth('access-token')
  async forwardAllParticipantMergedReport(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ) {
    return this.reportService.forwardAllParticipantMergedReport(bookingId);
  }

  @Get('get-participant-report/:bookingId')
  // @Roles(roleType.client)
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'participantId' })
  async getParticipantMergedReport(
    @Param('bookingId') bookingId: string,
    @Query() query: { participantId: string },
  ) {
    return this.reportService.getParticipantMergedReport(
      bookingId,
      query.participantId,
    );
  }

  @Patch('get-booking-event-report-participant/:bookingId')
  async forwardParticipantMergedReport(
    @Param('bookingId') bookingId: string,
    @Body() createForwardReportDto: CreateForwardReportDto,
  ) {
    return this.reportService.forwardParticipantMergedReport(bookingId,createForwardReportDto);
  }

  @Patch('update-report-status/:eventId')
  @Roles(roleType.dataEntry, roleType.unitCoordinator)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'status', enum: reportPublishType })
  async updateReportStatus(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Query() query: { status: reportPublishType },
  ) {
    return this.reportService.updateReportStatus(eventId, query.status);
  }

  @Patch('update-result/:resultId')
  @Roles(roleType.unitCoordinator, roleType.dataEntry)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  async updateResult(
    @Param('resultId', ParseUUIDPipe) resultId: string,
    @Body() createResultDto: CreateResultDto,
  ) {
    return this.reportService.updateResult(resultId, createResultDto);
  }

  @Delete('delete-result')
  @Roles(roleType.unitCoordinator, roleType.dataEntry)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  async deleteResult(@Body() getparticipantReportDto: GetparticipantReportDto) {
    return this.reportService.deleteResult(getparticipantReportDto);
  }
}
