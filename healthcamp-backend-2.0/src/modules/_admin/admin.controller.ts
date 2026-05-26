
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Query, BadRequestException, UseInterceptors, Req, UploadedFile, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth} from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { deptType, roleType } from 'src/helper/types/index.type';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AdminService } from './admin.service';
import { CreateAminProfileDto } from './dto/create-adminProfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/helper/utils/files_upload';

@Controller('admin')
@ApiTags("Admin")
@ApiResponse({ status: 201, description: "Created Successfully" })
@ApiResponse({ status: 401, description: "Unathorised request" })
@ApiResponse({ status: 400, description: "Bad request" })
@ApiResponse({ status: 500, description: "Server Error" })
// @UseInterceptors(CacheInterceptor)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly uploadService: UploadService,
  ) { }

  @Post("create")
  // @UseGuards(AtGuard)
  // @Roles(roleType.businessHead) 
  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'create admin' })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @UseGuards(AtGuard)
  @Roles(roleType.businessHead)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Find all admin from businesshead' })
  findAll() {
    return this.adminService.findAll();
  }
  
  @Get('get-by-role')
  @ApiOperation({ summary: "get not assigned member" })
  @ApiQuery({name:'role'})
  findAdminByRole(@Query() query:{role:deptType}){
    const {role}=query;
    return this.adminService.findAdminByRole(role);
  }

  @Get('get-team-lead')
  @ApiOperation({ summary: "get all team leader" })
  findTeamLead(){
    return this.adminService.findTeamLead();
  }

  @Get('by-dept')
  @ApiQuery({ name: 'dept', required: true, description: `query should be one of ${Object.values(deptType)}`, type: String })
  findByDept(@Query('dept') dept) {
    if (Object.values(deptType).includes(dept)) {
      return this.adminService.findByDept(dept);
    } else {
      throw new BadRequestException("Invalid department")
    }
  }

  @Get('info')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  adminInfo(@Req() req:any) {
    const id=req.user.sub;
    return this.adminService.adminInfo(id);
  }
  
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findOne(id);
  }

  @Patch()
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  updateByAdmin(@Req() req:any, @Body() updateAdminDto: UpdateAdminDto) {
    const id=req.user.sub;
    return this.adminService.update(id, updateAdminDto);
  }


  @Patch('update-profile')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update admin profile' })
  @ApiBody({ type: CreateAminProfileDto })
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
    const adminId=req.user.sub;
    return this.adminService.updateProfile(adminId, s3response);
  }


  @Patch(':id')
  @UseGuards(AtGuard)
  @Roles(roleType.businessHead)
  @ApiBearerAuth('access-token')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @UseGuards(AtGuard)
  @Roles(roleType.businessHead)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Find all admin from businesshead' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.remove(id);
  }
}