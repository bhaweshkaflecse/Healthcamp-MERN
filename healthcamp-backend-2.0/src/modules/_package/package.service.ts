import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto, UpdatePriceDTO } from './dto/update-package.dto';
import { packageEntity } from 'src/model/sql/package.entity';
import { serviceEntity } from 'src/model/sql/service.entity';
import { priceEntity } from 'src/model/sql/price.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(packageEntity)
    private packageRepository: Repository<packageEntity>,
    @InjectRepository(serviceEntity)
    private serviceRepository: Repository<serviceEntity>,
    @InjectRepository(priceEntity)
    private priceRepository: Repository<priceEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    createPackageDto: CreatePackageDto,
    img,
  ): Promise<packageEntity> {
    // console.log(createPackageDto);
    const { services } = createPackageDto;
    if (services.length === 0) {
      throw new ForbiddenException('service not selected');
    }
    let existingService;
    // const services = typeof createPackageDto.services === 'string'
    //   ? JSON.parse(createPackageDto.services)
    //   : createPackageDto.services;
    if (services) {
      existingService = await this.serviceRepository.find({
        where: { id: In(createPackageDto.services) },
      });
      if (existingService.length !== createPackageDto.services.length) {
        throw new NotFoundException('One or more services are not valid');
      }
    }
    const newPackage = new packageEntity();
    newPackage.name = createPackageDto.name;
    newPackage.description = createPackageDto.description;
    if (img) {
      newPackage.img = img;
    }
    newPackage.service = existingService;

    const savedPackage = await this.packageRepository.save(newPackage);
    if (createPackageDto.prices && createPackageDto.prices.length > 0) {
      const prices = createPackageDto.prices.map((price) => {
        const newPrice = new priceEntity();
        newPrice.min = price.min;
        newPrice.max = price.max;
        newPrice.price = price.price;
        newPrice.package = savedPackage;
        return newPrice;
      });
      // console.log(prices);
      await this.priceRepository.save(prices);
    }
    try {
      await this.cacheManager.del('/api/v1/package');
      // console.log('Cache successfully deleted for key: /api/v1/package');
    } catch (error) {
      // console.error('Error deleting cache for key: /api/v1/package', error);
    }
    return savedPackage;
  }

  async findAll(paginationDto:PaginationDto) {
    const {page,pageSize}=paginationDto;
    const [packages,total]= await this.packageRepository.findAndCount({
      relations: ['service', 'price'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      packages,
      total,
      page,
      pageSize
    }
  }

  async findOne(id: string) {
    const packageData = await this.packageRepository.findOne({
      where: { id },
      relations: ['service', 'price'],
      
    });
    if (!packageData) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    return packageData;
  }

  // async update(id: string, updatePackageDto: UpdatePackageDto) {
  //   const packageToUpdate = await this.packageRepository.findOne({ where: { id }, relations: ['service', 'price'] });
  //   if (!packageToUpdate) {
  //     throw new NotFoundException(`Package not found`);
  //   }
  //   packageToUpdate.name = updatePackageDto.name;
  //   packageToUpdate.description = updatePackageDto.description;
  //   if (updatePackageDto.services.length) {
  //     packageToUpdate.service = updatePackageDto.services.map((item) => this.mapToserviceEntity(item))
  //   }
  //   if (updatePackageDto.prices.length) {
  //     const newPrice = new priceEntity();
  //     const prices = updatePackageDto.prices.map(price => {
  //       newPrice.min = price.min;
  //       newPrice.max = price.max;
  //       newPrice.price = price.price;
  //       newPrice.package = packageToUpdate;

  //       return newPrice;
  //     });
  //     await this.priceRepository.save(newPrice);
  //   }
  //   const updatedPackage = await this.packageRepository.save(packageToUpdate);
  //   await this.cacheManager.del("/api/v1/package")
  //   await this.cacheManager.del(`/api/v1/package/${id}`)
  //   return updatedPackage;
  // }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const packageToUpdate = await this.packageRepository.findOne({
      where: { id },
      relations: ['service', 'price'],
    });
    if (!packageToUpdate) {
      throw new NotFoundException(`Package not found`);
    }
    packageToUpdate.name = updatePackageDto.name;
    packageToUpdate.description = updatePackageDto.description;
    if (updatePackageDto.services && updatePackageDto.services.length) {
      const services = await this.serviceRepository.find({
        where: { id: In(updatePackageDto.services) },
      });
      packageToUpdate.service = services;
    }

    // Update prices
    if (updatePackageDto.prices && updatePackageDto.prices.length) {
      await this.priceRepository.delete({ package: packageToUpdate });
      const newPrices = updatePackageDto.prices.map((priceDto) => {
        const newPrice = new priceEntity();
        newPrice.min = priceDto.min;
        newPrice.max = priceDto.max;
        newPrice.price = priceDto.price;
        newPrice.package = packageToUpdate;
        return newPrice;
      });
      packageToUpdate.price = await this.priceRepository.save(newPrices);
    }
    const updatedPackage = await this.packageRepository.save(packageToUpdate);
    await this.cacheManager.del('/api/v1/package');
    await this.cacheManager.del(`/api/v1/package/${id}`);
    // console.log(updatePackageDto);
    return { message: 'Updated successfully' };
  }

  async updateImage(id:string,image:any){
    await this.packageRepository.update({id},{img:image});
     return true;
  }
  

  async remove(id: string) {
    const packageToDelete = await this.packageRepository.findOne({
      where: { id },
      relations: ['price'],
    });

    if (!packageToDelete) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    await this.priceRepository.delete({ package: packageToDelete });
    await this.packageRepository.delete(id);
    await this.cacheManager.del('/api/v1/package');
    await this.cacheManager.del(`/api/v1/package/${id}`);
    return { message: `Package with ID ${id} deleted successfully` };
  }

  async deletePrice(id: string): Promise<boolean> {
    const existingPrice = await this.priceRepository.findOne({
      where: { id: id },
      relations: ['package'],
    });
    const packageID = existingPrice?.package.id;
    if (!existingPrice) {
      throw new NotFoundException('Price not found');
    }
    const deleteResult = await this.priceRepository.delete({ id: id });
    if (deleteResult.affected === 0) {
      throw new NotFoundException('Attribute not found.');
    }
    await this.cacheManager.del('/api/v1/package');
    await this.cacheManager.del(`/api/v1/package/${packageID}`);
    return true;
  }

  async updatePrice(body: UpdatePriceDTO, id): Promise<priceEntity> {
    const existingPrice = await this.priceRepository.findOne({
      where: { id: id },
      relations: ['package'],
    });
    const packageID = existingPrice?.package.id;
    if (!existingPrice) {
      throw new NotFoundException('Price not found');
    }
    existingPrice.min = body.min;
    existingPrice.max = body.max;
    existingPrice.price = body.price;
    const res = await this.priceRepository.save(existingPrice);
    await this.cacheManager.del('/api/v1/package');
    await this.cacheManager.del(`/api/v1/package/${packageID}`);
    return res;
  }
}
