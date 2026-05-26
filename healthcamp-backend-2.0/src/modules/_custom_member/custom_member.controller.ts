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
  ParseFilePipe,
  FileTypeValidator,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CustomMemberService } from './custom_member.service';
import { CreateCustomMemberDto } from './dto/create-custom_member.dto';
import { UpdateCustomMemberDto } from './dto/update-custom_member.dto';
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
import { UploadService } from 'src/helper/utils/files_upload';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { roleType } from 'src/helper/types/index.type';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Controller('custom-member')
@ApiTags('custom member')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class CustomMemberController {
  constructor(
    private readonly customMemberService: CustomMemberService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('create-assign/:subteamId')
  @Roles(roleType.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create and assign custom member' })
  @ApiBody({ type: CreateCustomMemberDto })
  @UseInterceptors(FileInterceptor('profile'))
  async create(
    @Param('subteamId') subteamId: string,
    @Body() createCustomMemberDto: CreateCustomMemberDto,
    @UploadedFile()
    file? // new ParseFilePipe({
    //   validators: [
    //     // new MaxFileSizeValidator({ maxSize: 1000 }),
    //     new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
    //   ],
    // }),
    : Express.Multer.File,
  ) {
    // const profile = file?await this.uploadService.upload(file.originalname, file.buffer):null;
    const profile = file ? await this.uploadService.upload(file) : null;
    return this.customMemberService.create(
      subteamId,
      profile,
      createCustomMemberDto,
    );
  }

  @Get()
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'pageSize', type: 'number' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.customMemberService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customMemberService.findOne(id);
  }

  @Patch(':id')
  @Roles(roleType.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomMemberDto: UpdateCustomMemberDto,
  ) {
    return this.customMemberService.update(+id, updateCustomMemberDto);
  }

  @Delete(':id')
  @Roles(roleType.businessHead)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customMemberService.remove(id);
  }
}
