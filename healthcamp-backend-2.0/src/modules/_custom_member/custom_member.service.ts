import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCustomMemberDto } from './dto/create-custom_member.dto';
import { UpdateCustomMemberDto } from './dto/update-custom_member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { customEntity } from 'src/model/sql/customMember.entity';
import { DataSource, Repository } from 'typeorm';
import { subTeamEntity } from 'src/model/sql/subTeam.entity';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Injectable()
export class CustomMemberService {
  constructor(
    @InjectRepository(customEntity)
    private readonly customRepository:Repository<customEntity>,
    @InjectRepository(subTeamEntity)
    private readonly subTeamRepository:Repository<subTeamEntity>,

    private dataSource: DataSource,
  ){}
  async create(id: string, profile: string, createCustomMemberDto: CreateCustomMemberDto): Promise<Boolean> {
    const { name, email, address, contact } = createCustomMemberDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
        await queryRunner.startTransaction();
        
        const custom = new customEntity();
        custom.name = name;
        custom.email = email;
        custom.address = address;
        custom.contact = contact;
        custom.profile = profile ? profile : null;
        await queryRunner.manager.save(custom);

        const subTeam = await queryRunner.manager.findOne(subTeamEntity, {
            where: { id },
            relations: ['custom']
        });

        subTeam.custom.push(custom);
        await queryRunner.manager.save(subTeam);

        await queryRunner.commitTransaction();
        return true;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}

 async findAll(paginationDto:PaginationDto) {
  const {page,pageSize}=paginationDto;
 const [customMembers,total]=  await this.customRepository.findAndCount({
  skip: (page - 1) * pageSize,
  take: pageSize,
  select:['id','name','email']
});
    return {
      customMembers,
      page,
      pageSize,
      total
    }
  }

  async findOne(id: string):Promise<customEntity> {
    const customMember=await this.customRepository.findOne({where:{id}});
    return customMember;
  }

  update(id: number, updateCustomMemberDto: UpdateCustomMemberDto) {
    return `This action updates a #${id} customMember`;
  }

  async remove(id: string):Promise<Boolean> {
    const customMember=await this.customRepository.findOne({where:{id}});
    await this.customRepository.remove(customMember);
    return true;
  }
}
