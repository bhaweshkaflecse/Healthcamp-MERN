import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  ParseFilePipe,
  FileTypeValidator,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { CreateClientProfileDto } from './dto/create-clientProfile.dto';
import { UploadService } from 'src/helper/utils/files_upload';
import { CreatePurchasePackageDto } from './dto/create-purchasePackage.dto';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import {  roleType as role } from 'src/helper/types/index.type';
import { kycStatus } from 'src/helper/types/index.type';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Controller('client')
@ApiTags('Client')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly uploadService: UploadService,
  ) { }

  @Post('create')
  @ApiOperation({ summary: 'Create a client' })
  @ApiBody({ type: CreateClientDto })
  register(@Body() createClientDto: CreateClientDto) {
    return this.clientService.register(createClientDto);
  }

  @UseGuards(AtGuard)
  @Post('purchase-package/:priceId')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'purchase package' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreatePurchasePackageDto })
  @UseInterceptors(FileInterceptor('paymentProof'))
  async create(
    @Param('priceId',ParseUUIDPipe) priceId: string,
    @Body() createPurchasePackageDto: CreatePurchasePackageDto,
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
    const clientId = req.user.sub;
    // const s3response = await this.uploadService.upload(
    //   file.originalname,
    //   file.buffer,
    // );
    const s3response = await this.uploadService.upload(file);
    return this.clientService.purchasePackage(
      createPurchasePackageDto,
      priceId,
      s3response,
      clientId,
    );
  }

  @Get()
  // @UseGuards(AtGuard)
  // @ApiBearerAuth('access-token')
  findAll(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const perPageNumber = parseInt(perPage) || 10;

    return this.clientService.findAll(pageNumber, perPageNumber);
  }

  @Get("info")
  // @UseInterceptors(CacheInterceptor)
  @Roles(role.client)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  getInfo(@Req() req:any) {
    const id=req.user.sub;
    return this.clientService.getClintInfo(id);
  }

  @Get('get-by-kyc-status')
  @ApiOperation({ summary: "get not assigned member" })
  @ApiQuery({name:'status'})
  findClientByKycStatus(@Query() query:{status:kycStatus}){
    const {status}=query;
    // console.log(status)
    return this.clientService.findClientByKycStatus(status);
  }

  @Get('get-by-teamlead')
  @ApiQuery({ name: "page", type: "number" })
  @ApiQuery({ name: "pageSize", type: "number" })
  @Roles(role.teamLead)
  @UseGuards(AtGuard,RolesGuard)
  @ApiBearerAuth('access-token')
  findByTeamLead(@Req() req:any,@Query() paginationDto: PaginationDto){
    const teamLeadId=req.user.sub;
    return this.clientService.findByTeamLead(teamLeadId,paginationDto);
  }

  @Get('new-register/:teamId')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  findNewRegister(@Param('teamId',ParseUUIDPipe) teamId: string){
    return this.clientService.findNewRegister(teamId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get a client' })
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Get('email')
  @ApiQuery({ name: 'email' })
  findByEmail(@Body() query: { email: string }) {
    return this.clientService.findByEmail(query);
  }

  @Patch('update-profile')
  @Roles(role.client)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update client kyc' })
  @ApiBody({ type: CreateClientProfileDto })
  @UseInterceptors(FileInterceptor('profile'))
  async updateProfile(
    @Req() req:any,
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
    // const s3response = await this.uploadService.upload(
    //   file.originalname,
    //   file.buffer,
    // );
    const s3response = await this.uploadService.upload(file);
    const clientId=req.user.sub;
    return this.clientService.updateProfile(clientId, s3response);
  }

  @Patch('approve-payment/:id')
  @Roles(role.businessHead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  updatePayment(@Param('id',ParseUUIDPipe) id: string) {
    return this.clientService.updatePayment(id);
  }

  @Patch('assign-team-lead')
  @Roles(role.businessHead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @ApiQuery({name:'clientId'})
  @ApiQuery({name:'teamLeadId'})
  assignTeamLead(@Query() query:{clientId:string,teamLeadId:string}) {
    const {clientId,teamLeadId}=query;
    return this.clientService.assignTeamLead(clientId,teamLeadId);
  }

  @Patch('update')
  @Roles(role.client)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a client' })
  update( @Body() body: UpdateClientDto,@Req() req:any) {
    const id=req.user.sub;
    return this.clientService.update(id, body);
  }

  // @Post('reset-password')
  // @ApiOperation({ summary: "Reset client password" })
  // @ApiBody({ type: CreatePasswordResetDto })
  // updatePassword(@Body() createPasswordResetDto: CreatePasswordResetDto) {
  //   return this.clientService.updatePassword(createPasswordResetDto);
  // }

  @Delete(':id')
  @Roles(role.client)
  @UseGuards(AtGuard,RolesGuard)
  @ApiBearerAuth('access-token')
  async remove(@Param('id') id: string,@Req() req:any) {
    // const id=req.user.sub;
    return this.clientService.remove(id);
  }
}
