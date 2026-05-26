import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  ParseFilePipe,
  FileTypeValidator,
  UploadedFiles,
  ParseUUIDPipe,
} from '@nestjs/common';
import { KycService } from './kyc.service';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { Roles } from 'src/decorators/role.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { roleType as role } from 'src/helper/types/index.type';

import { CreateProfileDto } from './dto/create-profile.dto';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { UploadService } from 'src/helper/utils/files_upload';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { rejectCommentDto } from './dto/create-kycComment.dto';

@Controller('kyc')
@ApiTags(' KYC')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class KycController {
  constructor(
    private readonly kycService: KycService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('add-document')
  @Roles(role.client)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('document'))
  async addKycDocument(
    @Req() req: any,
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
    const id = req.user.id;
    const document = await this.uploadService.upload(file);
    return this.kycService.addKycDocument(id, document);
  }

  @Post('create')
  @Roles(role.client)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update client kyc' })
  @ApiBody({ type: CreateKycDto })
  @UseInterceptors(FilesInterceptor('documents', 10))
  async create(
    @Body() createKycDto: CreateKycDto,
    @Req() req: any,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
        ],
      }),
    )
    files: Express.Multer.File[], // Accept multiple files
  ) {
    // console.log(createKycDto.document);
    // console.log(createKycDto);

    const clientId = req.user.sub;

    // console.log(files)
    // Upload all files to S3
    const s3Responses = await Promise.all(
      files?.map((file) => this.uploadService.upload(file)),
    );
    return this.kycService.create(createKycDto, clientId, s3Responses);
  }

  @Patch('update')
  @Roles(role.client)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update client kyc' })
  @ApiBody({ type: CreateKycDto })
  @UseInterceptors(FilesInterceptor('documents', 10))
  async updateKyc(
    @Body() createKycDto: CreateKycDto,
    @Req() req: any,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    const clientId = req.user.sub;
    const s3Responses = await Promise.all(
      files?.map((file) => this.uploadService.upload(file)),
    );
    return this.kycService.updateKyc(createKycDto, clientId, s3Responses);
  }

  @Patch('update-document/:id')
  @Roles(role.client)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('document'))
  async updateKycDocument(
    @Param('id', ParseUUIDPipe) id: string,
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
    const document = await this.uploadService.upload(file);
    return this.kycService.updateKycDocument(id, document);
  }

  @Get(':clientId')
  findOne(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.kycService.findOne(clientId);
  }

  @Patch('verify/:clientId')
  @Roles(role.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'verify kyc' })
  verifyKyc(@Param('clientId') clientId: string) {
    return this.kycService.verifyKyc(clientId);
  }

  @Patch('reject/:clientId')
  @Roles(role.teamLead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'reject kyc' })
  rejectKyc(
    @Param('clientId') clientId: string,
    @Body() kycRejectCommentDto: rejectCommentDto,
  ) {
    return this.kycService.rejectKyc(kycRejectCommentDto, clientId);
  }

  @Delete('document/:id')
  @Roles(role.client,role.teamLead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  removeDocument(@Param('id', ParseUUIDPipe) id: string) {
    return this.kycService.removeDocument(id);
  }

  @Delete(':id')
  @Roles(role.client, role.teamLead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.kycService.remove(id);
  }
}
