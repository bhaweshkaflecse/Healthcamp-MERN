import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors, UseGuards, Query, ForbiddenException } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType as role, subteamAssignServiceType } from 'src/helper/types/index.type';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Controller('service')
@ApiTags("Services")
// @UseInterceptors(CacheInterceptor)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }

  @Post()
  @ApiOperation({ summary: 'Create service' })
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard)
  @Roles(role.businessHead)
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiQuery({ name: "page", type: "number" })
  @ApiQuery({ name: "pageSize", type: "number" })
  @UseGuards(AtGuard)
  @Roles(role.businessHead)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Find all service with their association' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.serviceService.findAll(paginationDto);
  }

  @Get("by-calendar")
  @UseGuards(AtGuard)
  // @Roles(role.teamLead)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Find all service and calendar status from the packageId' })
  @ApiQuery({ name: 'id', type: 'string', required: true, description: 'Package ID (UUID)' })
  findAllServiceByCalendar(@Query('id', ParseUUIDPipe) id: string) {
    return this.serviceService.findAllServiceByCalendar(id);
  }

  @Get("by-assign-subteam")
  @ApiQuery({name:'type',enum:subteamAssignServiceType})
  findServiceBySubteam(@Query() query:{type:subteamAssignServiceType}){
   return this.serviceService.findServiceBySubteam(query.type);
  }

  @Get(':id')
  @UseGuards(AtGuard)
  @Roles(role.businessHead)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Find all service with their association by the serviceID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update service by the serviceID' })
  @UseGuards(AtGuard)
  @Roles(role.businessHead)
  @ApiBearerAuth('access-token')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service by the id' })
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @Roles(role.businessHead)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.removeService(id);
  }

  @Delete('attribute/:id')
  @ApiOperation({ summary: 'Delete attribute by AttributeID' })
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @Roles(role.businessHead)
  removeAttr(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.removeAttribute(id);
  }
}
