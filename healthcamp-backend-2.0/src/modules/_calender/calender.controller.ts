import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { CalenderService } from './calender.service';
import { CreateCalenderDto, updateDateSlotDto } from './dto/create-calender.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { checkIsDateAddedDto, InsertDateSlotdto } from '../_subteam/dto/InsertDateSlot.dto';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType } from 'src/helper/types/index.type';

@Controller('calender')
@ApiTags("Service Calendar")
export class CalenderController {
  constructor(private readonly calenderService: CalenderService) { }

  @Post("")
  @UseGuards(AtGuard,RolesGuard)
  @Roles(roleType.businessHead,roleType.teamLead,roleType.unitCoordinator)
  @ApiOperation({ summary: "create a calender for respective service" })
  createCalender(@Body() createCalenderDto: CreateCalenderDto) {
    return this.calenderService.create(createCalenderDto);
  }

  @Post("date-slot")
  @UseGuards(AtGuard,RolesGuard)
  @Roles(roleType.businessHead,roleType.teamLead,roleType.unitCoordinator)
  @ApiOperation({ summary: "Update perticular date" })
  InsertDateSlot(@Body() createCalenderDto: InsertDateSlotdto) {
    return this.calenderService.InsertDateSlot(createCalenderDto);
  }

  @Get('is-date-added')
  @ApiOperation({ summary: 'Check if date is added' })
  @ApiQuery({ name: 'date', required: true, type: String })
  @ApiQuery({ name: 'calendar', required: true, type: String })
  isDateAdded(@Query() query: checkIsDateAddedDto): Promise<boolean> {
    return this.calenderService.isDateAdded(query);
  } 

  @Get(':id')
  @ApiOperation({ summary: "Get detail of perticular day by service id" })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.calenderService.findOne(id);
  }

  @Patch('date-slot/:id')
  @ApiOperation({ summary: "Update perticular date by id" })
  updateDateSlot(@Param('id', ParseUUIDPipe) id: string, @Body() body: updateDateSlotDto) {
    return this.calenderService.updateDateSlot(id, body);
  }
}