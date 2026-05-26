import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import {
  enrollStatus,
  JwtPayload,
  roleType as role,
  roleType,
} from 'src/helper/types/index.type';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePaymentDto } from '../_payment/dto/create-payment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/helper/utils/files_upload';
import { enrollmentStatusDto } from './dto/create-enrollStatus.dto';
import { rejectCommentDto } from '../_kyc/dto/create-kycComment.dto';
import { query } from 'express';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Controller('enrollment')
@ApiTags(' Enrollment')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class EnrollmentController {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly uploadService: UploadService,
  ) { }

  @Post(':packageId')
  @Roles(role.client)
  @UseGuards(AtGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload payment details' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('proof'))
  async create(
    @Param('packageId', ParseUUIDPipe) packageId: string,
    @Req() req: any,
    @Body() CreatePaymentDto: CreatePaymentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const clientId = req.user.sub;
    // const s3response = await this.uploadService.upload(
    //   file.originalname,
    //   file.buffer,
    // );
    const s3response = await this.uploadService.upload(file);
    return this.enrollmentService.create(
      clientId,
      packageId,
      s3response,
      CreatePaymentDto,
    );
  }

  @Get('package-by-client-status')
  @Roles(role.client)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'status' })
  findByClientStatus(
    @Query() query: { status: enrollStatus },
    @Req() req: any,
  ) {
    const clientId = req.user.sub;
    const { status } = query;
    return this.enrollmentService.findByClientStatus(clientId, status);
  }

  @Get('find-by-status')
  @Roles(role.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'status' })
  findByTeamLead(@Query() query: enrollmentStatusDto, @Req() req: any) {
    const teamleadId = req.user.sub;
    const { status } = query;
    return this.enrollmentService.findByTeamlead(teamleadId, status);
  }

  @Get('package-by-status')
  @ApiQuery({ name: 'status' })
  findByStatus(@Query() query: { status: enrollStatus }) {
    const { status } = query;
    return this.enrollmentService.findByStatus(status);
  }

  @Get('sold-package')
  soldPackage(@Query('page') page: string, @Query('perPage') perPage: string) {
    const pageNumber = parseInt(page) || 1;
    const perPageNumber = parseInt(perPage) || 10;
    return this.enrollmentService.soldPackage(pageNumber, perPageNumber);
  }

  @Get('clients-by-package/:id')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'pageSize', type: 'number' })
  @ApiQuery({ name: 'teamLeadId' })
  getEnrollmentByPackage(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: { teamLeadId: string },
    @Query() paginationDto: PaginationDto,
  ) {
    return this.enrollmentService.getEnrollmentByPackage(
      id,
      query.teamLeadId,
      paginationDto,
    );
  }

  @Get('all-participant/:id')
  allParticipant(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentService.allParticipant(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentService.findOne(id);
  }

  @Patch('verify-package/:id')
  @Roles(role.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  verifyPackage(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentService.verifyPackage(id);
  }

  @Patch('reject-package/:id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(role.teamLead)
  @ApiBearerAuth('access-token')
  rejectPackage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: rejectCommentDto,
  ) {
    return this.enrollmentService.rejectPackage(id, body);
  }

  @Patch(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(role.businessHead, roleType.client, role.businessHead)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentService.update(+id, updateEnrollmentDto);
  }

  @Delete(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(role.teamLead, role.client, role.businessHead)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentService.remove(id);
  }
}
