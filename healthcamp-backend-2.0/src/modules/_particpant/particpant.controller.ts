import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { ParticpantService } from './particpant.service';
import { CheckParticipantEventDto, CreateParticpantDto, EventListDto } from './dto/create-particpant.dto';
import { UpdateParticpantDto } from './dto/update-particpant.dto';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType as role } from 'src/helper/types/index.type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { UploadService } from 'src/helper/utils/files_upload';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSampleFiletDto } from './dto/create-sampleFile.dto';
import * as multer from 'multer';
import * as xlsx from 'xlsx';
import { EntityManager } from 'typeorm';


@Controller('participant')
@ApiTags('Participant')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class ParticpantController {
  constructor(
    private readonly particpantService: ParticpantService,
    private readonly uploadService: UploadService,
    private readonly entityManager: EntityManager,
  ) { }

  @Post()
  @Roles(role.client)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'create participant' })
  @ApiBody({ type: CreateParticpantDto })
  create(@Body() createParticpantDto: CreateParticpantDto, @Req() req: any) {
    const clientId = req.user.sub; 
    return this.particpantService.create(createParticpantDto, clientId);
  }


  @Post('bulk-upload-participant')
  @Roles(role.client)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'Bulk upload participant' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSampleFiletDto })
  @UseInterceptors(
    FileInterceptor('participantFile', {
      storage: multer.memoryStorage(),
    }),
  )
  async bulkUploadParticipant(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const id = req.user.sub;
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!file.originalname.match(/\.(xls|xlsx)$/)) {
      throw new BadRequestException('Only Excel files are allowed');
    }
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    if (sheetData.length <= 1) {
      throw new BadRequestException('Uploaded file is empty or has no data rows');
    }

    const dataRows = sheetData.slice(1);
  
    const formattedData = dataRows.map((row) => ({
      name: row[0],
      address: row[1],
      gender: row[2],
      grade: row[3],
      phone: row[4],
      email: row[5],
    }));
    return await this.particpantService.bulkUploadParticipant(formattedData, id, this.entityManager);
  }

  @Post('add-participant-in-event/:id')
  addParticipantEvent(@Param('id') id:string,@Body() participant:{participantIds:string[]}){
    return this.particpantService.addParticipantEvent(id,participant.participantIds)
  }

  @Get('get-all-participant-in-spreadsheet')
  @Roles(role.client)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all participant in spreadsheet' })
  getAllParticipantInSpreadsheet(@Res() res: Response, @Req() req: any) {
    const clientId = req.user.sub;
    return this.particpantService.getAllParticipantInSpreadsheet(clientId, res);
  }

  @Get('get-all-participant-in-event/:id')
  @Roles(role.client)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all participant in event' })
  getAllParticipantInEvent(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    const clientId = req.user.sub;
    return this.particpantService.getAllParticipantInEvent(id, clientId);
  }

  @Get('get-sample-file-to-upload-participant')
  @Roles(role.client)
  @ApiBearerAuth('access-token') 
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'Get sample file to upload participant' })
  getSampleFileToUploadParticipant(@Res() res: Response) {
    return this.particpantService.getSampleFileToUploadParticipant(res);
  }

  @Post('get-if-participant-exist-in-event')
  @Roles(role.dataEntry)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'Get if participant exist in event' })
  getIfParticipantExistInEvent(@Body() Body: CheckParticipantEventDto) {
    const { eventId, participantId } = Body;
    return this.particpantService.getIfParticipantExistInEvent(eventId, participantId);
  }

  // @Post('sample-file-upload')
  // @UseGuards(AtGuard)
  // @ApiBearerAuth('access-token')
  // @ApiConsumes('multipart/form-data')
  // @ApiOperation({ summary: 'Bulk upload participant' })
  // @ApiBody({ type: CreateSampleFiletDto })
  // @UseInterceptors(FileInterceptor('samplefile'))
  // async sampleFileUpload(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new FileTypeValidator({
  //           fileType:
  //             /application\/vnd\.ms-excel|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|text\/csv/,
  //         }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   const s3response = await this.uploadService.upload(file);
  //   return this.particpantService.sampleFileUpload(s3response);
  // }

  // @Post('participant-file-upload')
  // @UseGuards(AtGuard)
  // @ApiBearerAuth('access-token')
  // @ApiConsumes('multipart/form-data')
  // @ApiOperation({ summary: 'Update client kyc' })
  // @ApiBody({ type: CreateSampleFiletDto })
  // @UseInterceptors(FileInterceptor('samplefile'))
  // async participantFileUpload(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new FileTypeValidator({
  //           fileType:
  //             /application\/vnd\.ms-excel|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|text\/csv/,
  //         }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  //   @Req() req: any
  // ) {
  //   const id = req.user.sub;
  //   return this.particpantService.uploadFile(file, id)
  // }

  @Get('client')
  @Roles(role.client)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'get client participant' })
  findAll(@Req() req: any) {
    const clientId = req.user.sub;
    return this.particpantService.findAll(clientId);
  }

  @Get('unique-participant-of-event/:id')
  @Roles(role.client)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'get client participant' })
  findAllUniqueParticipantOfEvent(@Req() req: any, @Param('id') id: string) {
    const clientId = req.user.sub;
    return this.particpantService.findAllUniqueParticipantOfEvent(id, clientId);
  }

  // @Get('sample-file')
  // getSampleFile() {
  //   return this.particpantService.getSampleFile();
  // }

  // @Get('grade')
  // @Roles(role.client)
  // @ApiBearerAuth('access-token')
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiOperation({ summary: 'create participant' })
  // @ApiQuery({ name: 'grade' })
  // findByGrade(@Query() query: any, @Req() req: any) {
  //   const { grade } = query;
  //   const id = req.user.sub;
  //   return this.particpantService.findByGrade(id, grade);
  // }

  // @Get('participant-name-id')
  // @Roles(role.client)
  // @ApiBearerAuth('access-token')
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiOperation({ summary: 'create participant' })
  // @ApiQuery({ name: 'name' })
  // @ApiQuery({ name: 'participantId' })
  // findByQuery(@Query() query: { name: string, participantId: string }, @Req() req: any) {
  //   const { name, participantId } = query;
  //   const id = req.user.sub;
  //   return this.particpantService.findByNameParticipantId(id, name, participantId);
  // }

  @Get("participants-of-event/:id")
  @Roles(role.client)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all participant of the event' })
  getParticipantOfEvent(@Param('id', ParseUUIDPipe) id: string) {
    return this.particpantService.getParticipantOfEvent(id);
  }

  @Get('event/:id')
  // @Roles(role.dataEntry)
  // @ApiBearerAuth('access-token')
  // @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all participant of the event' })
  eventParticipant(@Param('id', ParseUUIDPipe) id: string) {
    return this.particpantService.eventParticipant(id);
  }

  @Patch('enrollment')
  findEnrollmentParticipant(@Body() eventListDto:EventListDto){
    const {eventIds}=eventListDto;
  return this.particpantService.findEnrollmentParticipant(eventIds)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get each participant' })
  findOne(@Param('id') id: string) {
    return this.particpantService.findOne(id);
  }

  // @Patch('grade')
  // @Roles(role.client)
  // @ApiBearerAuth('access-token')
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiOperation({ summary: 'create participant' })
  // @ApiQuery({name:'grade'})
  // @ApiQuery({name:'updated_grade'})
  // updateGrade(@Query() query:any,@Req() req:any){
  //   const {grade,updated_grade}=query;
  //   const id=req.user.sub;
  //   return this.particpantService.updateGrade(id,grade,updated_grade);
  // }

  @Patch("update-participant/:id")
  @Roles(role.client)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'Update participant' })
  update(
    @Param('id') id: string,
    @Body() updateParticpantDto: UpdateParticpantDto,
  ) {
    return this.particpantService.update(id, updateParticpantDto);
  }

  @Delete(':id')
  @Roles(role.client)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiOperation({ summary: 'delete participant' })
  remove(@Param('id') id: string) {
    return this.particpantService.remove(id);
  }
}