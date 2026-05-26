import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto, UpdatePriceDTO } from './dto/update-package.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/helper/utils/files_upload';
import { AtStrategy } from 'src/middlewares/access_token/at.strategy';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { roleType } from 'src/helper/types/index.type';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Controller('package')
@ApiTags('Package')
// @UseInterceptors(CacheInterceptor)
export class PackageController {
  constructor(
    private readonly packageService: PackageService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @Roles(roleType.businessHead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @Body() createPackageDto: CreatePackageDto,
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
    // const s3response = await this.uploadService.upload(file.originalname, file.buffer);
    const s3response = await this.uploadService.upload(file);
    return this.packageService.create(createPackageDto, s3response);
  }

  @Patch('update-price/:id')
  @Roles(roleType.businessHead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  // @ApiQuery({ name: 'name', required: false, type: String })
  updatePrice(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdatePriceDTO,
  ) {
    return this.packageService.updatePrice(body, id);
  }

  @Patch('update-image/:id')
  @Roles(roleType.businessHead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('img'))
  async updateImage(
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
    // const s3response = await this.uploadService.upload(file.originalname, file.buffer);
    const s3response = await this.uploadService.upload(file);
    return this.packageService.updateImage(id, s3response);
  }

  @Get()
  @ApiQuery({ name: "page", type: "number" })
  @ApiQuery({ name: "pageSize", type: "number" })
  @UseGuards(AtStrategy)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.packageService.findAll(paginationDto);
  }

  @Get(':id')
  @UseGuards(AtStrategy)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.packageService.findOne(id);
  }

  @Patch(':id')
  @Roles(roleType.businessHead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return this.packageService.update(id, updatePackageDto);
  }

  @Delete('price/:id')
  @Roles(roleType.businessHead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  deletePrice(@Param('id', ParseUUIDPipe) id: string) {
    return this.packageService.deletePrice(id);
  }

  @Delete(':id')
  @Roles(roleType.businessHead)
  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard, RolesGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.packageService.remove(id);
  }
}
