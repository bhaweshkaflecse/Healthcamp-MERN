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
  UseInterceptors,
  FileTypeValidator,
  ParseFilePipe,
  UploadedFile,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType as role } from 'src/helper/types/index.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/helper/utils/files_upload';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { rejectCommentDto } from '../_kyc/dto/create-kycComment.dto';
import { RtGuard } from 'src/middlewares/refresh_token/rt.guard';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Controller('payment')
@ApiTags('Payment')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get('approved-payment')
  @ApiQuery({ name: "page", type: "number" })
  @ApiQuery({ name: "pageSize", type: "number" })
  @Roles(role.finance)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findApprovedPayment(@Req() req: any,@Query() paginationDto: PaginationDto) {
    const financeAdminId = req.user.sub;
    return this.paymentService.findApprovedPayment(financeAdminId,paginationDto);
  }

  @Get()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(role.finance, role.businessHead, role.teamLead)
  @ApiBearerAuth('access-token')
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('history')
  @ApiQuery({ name: "page", type: "number" })
  @ApiQuery({ name: "pageSize", type: "number" })
  @Roles(role.finance)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findHistory(@Req() req: any,@Query() paginationDto: PaginationDto) {
    const financeAdminId = req.user.sub;
    return this.paymentService.findHistory(financeAdminId,paginationDto);
  }

  @Get('log')
  @ApiQuery({ name: "page", type: "number" })
  @ApiQuery({ name: "pageSize", type: "number" })
  @Roles(role.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findPaymentLog(@Query() paginationDto: PaginationDto) {
    return this.paymentService.findPaymentLog(paginationDto);
  }

  @Get('package-bought')
  @ApiQuery({ name: "page", type: "number" })
  @ApiQuery({ name: "pageSize", type: "number" })
  @Roles(role.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  findPackageBought(@Query() paginationDto: PaginationDto) {
    return this.paymentService.findPackageBought(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(role.client, role.businessHead)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload payment details' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiQuery({ name: 'enrollId' })
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('proof'))
  async updatePayment(
    @Req() req: any,
    @Body() updatePaymentDto: CreatePaymentDto,
    @Query() query: { enrollId: string },
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
    const { enrollId } = query;
    // const s3response = await this.uploadService.upload(file.originalname, file.buffer);
    const s3response = await this.uploadService.upload(file);
    return this.paymentService.updatePayment(
      enrollId,
      s3response,
      updatePaymentDto,
    );
  }

  @Patch('verify-payment/:paymentId')
  @Roles(role.finance)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  verifyPayment(@Param('paymentId') paymentId: string, @Req() req: any) {
    const financeAdminId = req.user.sub;
    return this.paymentService.verifyPayment(paymentId, financeAdminId);
  }

  @Patch('reject-payment/:paymentId')
  @Roles(role.finance)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  rejectPackage(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
    @Req() req: any,
    @Body() body: rejectCommentDto,
  ) {
    const financeAdminId = req.user.sub;
    return this.paymentService.rejectPayment(paymentId, financeAdminId, body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  @Roles(role.finance)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.remove(+id);
  }
}
