import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { AssignCalendarService } from './_assign_calendar.service';
import { UpdateAssignCalendarDto } from './dto/update-_assign_calendar.dto';
import { ApiOperation, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateEventCalendarDto } from './dto/create-_assign_calendar.dto';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType } from 'src/helper/types/index.type';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';

@Controller('assign-calendar')
@ApiTags("Event Calendar")
export class AssignCalendarController {
  constructor(private readonly assignCalendarService: AssignCalendarService) { }

  @Post()
  @UseGuards(AtGuard)
  @ApiOperation({ summary: "assigned calender" })
  create(@Body() createEventCalendarDto: CreateEventCalendarDto) {
    return this.assignCalendarService.create(createEventCalendarDto);
  }

  @Get()
  @ApiQuery({ name: "serviceId" })
  @ApiQuery({ name: "clientId" })
  @ApiQuery({ name: "enrollId" })
  findOne(@Query('serviceId', ParseUUIDPipe) service, @Query('clientId') client, @Query('enrollId') enrollId) {
    if (!service || !client) {
      throw new BadRequestException("Payload Insufficency")
    }
    return this.assignCalendarService.findOne(service, client,enrollId); 
  }
 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventCalendarDto: UpdateAssignCalendarDto) {
    return this.assignCalendarService.update(id, updateEventCalendarDto);
  }

  @Get('service-of-package/:enrollId')
  @ApiQuery({ name: "packageId" })
  @UseGuards(AtGuard,RolesGuard)
  @ApiOperation({ summary: "get all service enrolled by user of the perticular package with status" })
  @Roles(roleType.client)
  getServicesOfPackage(@Param("enrollId",ParseUUIDPipe) enrollId:string, @Query('packageId', ParseUUIDPipe) packages, @Req() req) {
    const { user } = req;
    return this.assignCalendarService.getServicesOfPackage(enrollId,user.sub, packages)
  }

  @Get('for-service/:enrollId')
  @ApiQuery({ name: "serviceId" })
  @UseGuards(AtGuard,RolesGuard)
  @Roles(roleType.client)
  @ApiOperation({ summary: "get event calender by client" })
  geteventCalendar(@Param("enrollId",ParseUUIDPipe) enrollId:string,@Query('serviceId', ParseUUIDPipe) service, @Req() req) {
    const { user } = req;
    return this.assignCalendarService.getEventCalendar(enrollId,service, user.sub)
  }
  
  // @Delete(':id')
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.assignCalendarService.remove(id);
  // }
}