import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseUUIDPipe } from '@nestjs/common';
import { UnitCoordinatorService } from './unit-coordinator.service';
import { CreateUnitCoordinatorDto } from './dto/create-unit-coordinator.dto';
import { UpdateUnitCoordinatorDto } from './dto/update-unit-coordinator.dto';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { eventStatus, roleType as role } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Controller('unit-coordinator')
@ApiTags('unit-coordinator')
export class UnitCoordinatorController {
  constructor(private readonly unitCoordinatorService: UnitCoordinatorService) { }

  @Get('event')
  @ApiQuery({ name: "page", type: "number" })
  @ApiQuery({ name: "pageSize", type: "number" })
  @Roles(role.unitCoordinator)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'status', enum: eventStatus })
  @ApiOperation({ summary: 'upcoming and completed event for unit coordinator' })
  upcomingEvent(@Req() req: any, @Query() query: { status: eventStatus }, @Query() paginationDto: PaginationDto) {
    const unitId = req.user.sub;
    return this.unitCoordinatorService.upcomingEvent(unitId, query.status, paginationDto)
  }


  @Get('client-by-service/:serviceId')
  @Roles(role.unitCoordinator)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  getClientService(@Req() req: any, @Param('serviceId', ParseUUIDPipe) serviceId: string) {
    const id = req.user.sub;
    return this.unitCoordinatorService.getClientService(id, serviceId);
  }

  @Get()
  findAll() {
    return this.unitCoordinatorService.findAll();
  }

  @Get('hierarchy-info/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitCoordinatorService.findOne(id);
  }

  @Get('hierarchy')
  @Roles(role.unitCoordinator)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findHierarchy(@Req() req: any) {
    const id = req.user.sub;
    return this.unitCoordinatorService.findOne(id);
  }

  @Patch(':id')
  @Roles(role.unitCoordinator, role.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUnitCoordinatorDto: UpdateUnitCoordinatorDto) {
    return this.unitCoordinatorService.update(+id, updateUnitCoordinatorDto);
  }

  @Delete(':id')
  @Roles(role.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitCoordinatorService.remove(+id);
  }
}
