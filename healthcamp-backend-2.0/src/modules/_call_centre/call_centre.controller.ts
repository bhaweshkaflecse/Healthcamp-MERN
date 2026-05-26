import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { CallCentreService } from './call_centre.service';
import { CreateInqueryDto } from './dto/create-call_centre.dto';
import { UpdateCallCentreDto } from './dto/update-call_centre.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { callReasonType, callType, roleType } from 'src/helper/types/index.type';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';

@Controller('call-centre')
@ApiTags('Call_centre')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class CallCentreController {
  constructor(private readonly callCentreService: CallCentreService) { }

  @Post()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(roleType.callCentre)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a Enquiry' })
  @ApiBody({ type: CreateInqueryDto })
  create(@Body() CreateInqueryDto: CreateInqueryDto) {
    return this.callCentreService.create(CreateInqueryDto);
  }

  @Get()
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all Enquiry' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false, enum: callType })
  @ApiQuery({ name: 'reason', required: false, enum: callReasonType })
  findAll(@Query() query: { page: number, limit: number, status: callType, reason: callReasonType }) {
    const { page, limit, status, reason } = query;
    return this.callCentreService.findAll(page, limit, status, reason);
  }

  @Get(':id')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a Enquiry' })
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.callCentreService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a Enquiry' })
  @ApiBody({ type: CreateInqueryDto })
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateCallCentreDto: UpdateCallCentreDto) {
    return this.callCentreService.update(id, updateCallCentreDto);
  }

  @Delete(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(roleType.callCentre)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a Enquiry' })
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.callCentreService.remove(id);
  }
}