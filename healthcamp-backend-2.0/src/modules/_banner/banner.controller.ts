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
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/helper/utils/files_upload';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { roleType } from 'src/helper/types/index.type';
// import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('banner')
@ApiTags('Carasoul API')
// @UseInterceptors(CacheInterceptor)
export class BannerController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseGuards(AtGuard)
  @Roles(roleType.businessHead)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file for banner' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // const s3response = await this.uploadService.upload(file.originalname, file.buffer);
    const s3response = await this.uploadService.upload(file);
    return this.bannerService.create(s3response);
  }

  @Get()
  findAll() {
    return this.bannerService.findAll();
  }

  @Delete(':id')
  @UseGuards(AtGuard)
  @Roles(roleType.businessHead)
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }
}
