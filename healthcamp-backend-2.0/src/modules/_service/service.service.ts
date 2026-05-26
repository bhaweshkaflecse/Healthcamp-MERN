import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { serviceEntity } from 'src/model/sql/service.entity';
import { Between, In, IsNull, Not, Repository } from 'typeorm';
import { AttributeDto } from './dto/attribute.dto';
import { AttributeEntity } from 'src/model/sql/attribute.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { packageEntity } from 'src/model/sql/package.entity';
import { calenderEntity } from 'src/model/sql/serviceCalender.entity';
import { subteamAssignServiceType } from 'src/helper/types/index.type';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(serviceEntity)
    private serviceRepository: Repository<serviceEntity>,
    @InjectRepository(packageEntity)
    private packageRepository: Repository<packageEntity>,
    @InjectRepository(AttributeEntity)
    private attributeRepository: Repository<AttributeEntity>,
    @InjectRepository(calenderEntity)
    private calendarRepository: Repository<calenderEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const { name, description, attributes } = createServiceDto;
    // console.log(attributes);
    const service = new serviceEntity();
    service.name = name;
    service.description = description;
    service.attributes = attributes.map((attrDto) =>
      this.mapToAttributeEntity(attrDto),
    );
    return await this.serviceRepository.save(service);
  }

  async findAllServiceByCalendar(id: string) {
    const existingPackage = await this.packageRepository.findOne({
      where: { id },
    });
    if (!existingPackage) {
      throw new ForbiddenException('Invalid package');
    }
    const existingService = await this.serviceRepository.find({
      where: { package: { id: existingPackage.id } },
    });
    // console.log(existingService);
    if (!existingService) {
      return [];
    }
    const serviceIds = existingService.map((service) => service.id);
    const serviceCalendar = await this.calendarRepository.find({
      where: { service: In(serviceIds) },
      relations: ['service'],
    });
    const serviceIdsWithCalendar = new Set(
      serviceCalendar.map((calendar) => calendar.service.id),
    );
    return existingService.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      hasCalendar: serviceIdsWithCalendar.has(service.id),
    }));
  }

  async findAll(paginationDto: PaginationDto) {
    const {page,pageSize}=paginationDto;
    const [services,total] = await this.serviceRepository.findAndCount({
      relations: ['attributes'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const servicesWithCalendarStatus = await Promise.all(
      services.map(async (item) => {
        const isCalendar = await this.calendarRepository.findOne({
          where: { service: { id: item.id } },
        });
        return { ...item, hasCalender: !!isCalendar };
      }),
    );
    return {servicesWithCalendarStatus,total,page,pageSize};
  }

  async findOne(id: string) {
    const service = await this.serviceRepository.findOne({
      where: { id: id },
      relations: ['attributes'],
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async findServiceBySubteam(type: subteamAssignServiceType) {
    const services = await this.serviceRepository.find({
      relations: ['subTeam'],
      select:{
        id:true,
        name:true,
        description:true,
        createdAt:true,
        subTeam:{
          id:true,
          name:true,
        }
      }
    });
 
    const filterService = services.filter((service) =>
      (type == subteamAssignServiceType.true)
        ? service.subTeam.length > 0
        : service.subTeam.length == 0
    );
    return filterService;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.findOne(id);
    const { name, description, attributes } = updateServiceDto;
    service.name = name;
    service.description = description;
    if (attributes && attributes.length > 0) {
      const attributeEntities = attributes.map((attrDto) =>
        this.mapToAttributeEntity(attrDto),
      );
      service.attributes.push(...attributeEntities);
    }
    this.cacheManager.del('/api/v1/service');
    this.cacheManager.del(`/api/v1/service/${id}`);
    return await this.serviceRepository.save(service);
  }

  async removeService(id: string): Promise<boolean> {
    const isInPackage = await this.packageRepository.find({
      where: { service: { id: id } },
      relations: ['service'],
    });
    // console.log(isInPackage);
    for (const pkg of isInPackage) {
      pkg.service = pkg.service.filter((service) => service.id !== id);
      await this.packageRepository.save(pkg);
    }
    const deleteResult = await this.serviceRepository.softDelete({ id });
    if (deleteResult.affected === 0) {
      throw new NotFoundException('Service not found.');
    }
    // if (isInPackage) {
    //   this.packageRepository.delete({ service: { id: id } })
    // }
    // const deleteResult = await this.serviceRepository.delete({ id })
    // if (deleteResult.affected === 0) {
    //   throw new NotFoundException("Service not found.");
    // }
    this.cacheManager.del('/api/v1/service');
    this.cacheManager.del(`/api/v1/service/${id}`);
    return true;
  }

  async removeAttribute(id: string) {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['services'],
    });
    if (!attribute) {
      throw new NotFoundException('Attribute not found.');
    }
    // for (const service of attribute.services) {
    //   const fullService = await this.serviceRepository.findOne({ where: { id: service.id }, relations: ['attributes'] });
    //   if (fullService) {
    //     fullService.attributes = fullService.attributes.filter(attr => attr.id !== id);
    //     await this.serviceRepository.save(fullService);
    //     this.cacheManager.del(`/api/v1/service/${fullService.id}`)
    //   }
    // }
    const deleteResult = await this.attributeRepository.delete({ id });
    if (deleteResult.affected === 0) {
      throw new NotFoundException('Attribute not found.');
    }
    this.cacheManager.del('/api/v1/service');
    return true;
  }

  // utility
  private mapToAttributeEntity(attrDto) {
    const attribute = new AttributeEntity();
    attribute.name = attrDto;
    return attribute;
  }
}
