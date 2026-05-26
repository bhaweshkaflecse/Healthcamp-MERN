import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  ParseUUIDPipe,
  UploadedFiles,
  UseInterceptors,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { UploadService } from 'src/helper/utils/files_upload';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@ApiTags('Ticket')
@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @Roles(roleType.ITteam)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Ticket Title' },
        description: { type: 'string', example: 'Ticket Description' },
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  async createTicket(
    @Body() createTicketDto: CreateTicketDto,
    @UploadedFiles() files: any,
  ) {
    const imageUrls = await this.uploadService.uploadMultiple(files?.files);
    return this.ticketService.create(createTicketDto, imageUrls);
  }

  @Patch(':id')
  @Roles(roleType.ITteam)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'Update an existing ticket' })
  updateTicket(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete('image/:id')
  @Roles(roleType.ITteam)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete an image from a ticket' })
  deleteTicketImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketService.deleteImage(id);
  }

  @Post('image/:id')
  @Roles(roleType.ITteam)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  @ApiOperation({ summary: 'Add an image to a ticket' })
  async addTicketImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: any,
  ) {
    const imageUrls = await this.uploadService.uploadMultiple(files?.files);
    return this.ticketService.addImage(imageUrls, id);
  }

  @Delete(':id')
  @Roles(roleType.ITteam)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'Soft delete a ticket' })
  softDeleteTicket(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketService.softDelete(id);
  }

  @Get()
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'pageSize', type: 'number' })
  @Roles(roleType.ITteam)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'View all tickets' })
  getAllTickets(@Query() paginationDto: PaginationDto) {
    return this.ticketService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(roleType.ITteam)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'View a ticket by ID' })
  getTicketById(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketService.findOne(id);
  }
}
