import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { adminEntity } from 'src/model/sql/admin.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, authDocument } from 'src/model/mongo/auth.schema';
import { Model } from 'mongoose';
import { hash } from 'src/helper/utils/hash';
import { deptType, roleType } from 'src/helper/types/index.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(adminEntity)
    private adminRepository: Repository<adminEntity>,

    @InjectModel(Auth.name)
    private authModel: Model<authDocument>,

    private dataSource: DataSource,
    private hash: hash,

    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }


  async create(createAdminDto: CreateAdminDto): Promise<boolean> {
    const {department}=createAdminDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // Connect the query runner to the database
  
    try {
      if (!queryRunner.isTransactionActive) {
        await queryRunner.startTransaction(); 
      }

      if(department===deptType.businessHead){
        const isBusinessheadExist=await this.adminRepository.findOne({where:{department}});
        if(isBusinessheadExist){
          throw new ForbiddenException('business head already exist.');
        }
      }
      
      const isDataExist = await this.adminRepository.findOne({
        where: [
          { contact: createAdminDto.contact },
          { email: createAdminDto.email },
        ],
      });
      if (isDataExist) {
        throw new ForbiddenException("Email or Phone already exists");
      }
  
      // Save admin data within the transaction
      const dataToSave = this.adminRepository.create(createAdminDto);
      const dataSaved = await queryRunner.manager.save(dataToSave);
  
      // Save auth model
      const model = new this.authModel();
      model.userID = dataSaved.id.toString();
      model.password = await this.hash.value(createAdminDto.password);
      await model.save();
  
      // Commit the transaction
      await queryRunner.commitTransaction();
  
      // Clear cache
      this.cacheManager.del("/api/v1/admin");
      Object.values(roleType).forEach((item) => {
        this.cacheManager.del(`/api/v1/admin/by-dept?dept=${item}`);
      });
  
      return true;
    } catch (error) {
      // Rollback the transaction if something goes wrong
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
  
  

  async adminInfo(id: string) {
    const adminInfo = await this.adminRepository.findOne({
      where: { id },
      select: ['id', 'name', 'department', 'profile', 'email', 'address', 'contact']
    });
    return adminInfo
  }


  async findAdminByRole(role: deptType) {
    // console.log(role);
    const admins = await this.adminRepository.find({
      where: { department: role },
      relations: ['team', 'leadTeam'],
      select: {
        id: true,
        profile: true,
        name: true,
        email: true,
        team: {
          id: true
        },
        leadTeam: {
          id: true
        }
      }
    });
    // console.log(admins);
    const excludedDepartments = ['data_entry', 'finance'];
    const staff = admins.filter((admin) => !admin.leadTeam && (admin.team.length == 0 || excludedDepartments.includes(role)));
    return staff
  }

  async findTeamLead() {
    const admins = await this.adminRepository.find({
      where: { department: deptType.teamLead },
      relations: ['leadTeam'],
      select: {
        id: true,
        profile: true,
        name: true,
        email: true,
        leadTeam: {
          id: true
        }
      }
    });
    // const teamleads = admins.filter((admin) => admin.leadTeam == null);
    return admins;
  }

  async findByDept(department: deptType): Promise<adminEntity[]> {
    return await this.adminRepository.find({ where: { department: department } })
  }

  async findAll() {
    const roledata = [
      { id: 1, name: "Bussiness Head", value: "business_head" },
      { id: 2, name: "Team Lead", value: "team_lead" },
      { id: 3, name: "Unit Cordinator", value: "unit_coordinator" },
      { id: 4, name: "Data Entry", value: "data_entry" },
      { id: 5, name: "Finance", value: "finance" },
      { id: 6, name: "Sales", value: "sales" },
      { id: 7, name: "Call Center", value: "call_centre" },
      { id: 8, name: "IT Team", value: "IT_team" },
    ];
    const results = await Promise.all(roledata.map(async item => {
      return {
        Roles: item.name,
        value: item.value,
        user: await this.adminRepository.find({
          where: {
            department: item.value as deptType
          },
          select: ["profile", "name"]
        })
      }
    }));
    return results;
  }

  async findOne(id: string): Promise<adminEntity> {
    return await this.adminRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    // console.log(id);
    const admin = await this.adminRepository.findOne({ where: { id } });
    // console.log(admin)
    if (!admin) {
      throw new ForbiddenException(`Admin not found`);
    }
    // packageToUpdate.name = updateAdminDto.name
    // packageToUpdate.address = updateAdminDto.address
    // packageToUpdate.department = updateAdminDto.department
    // packageToUpdate.contact = +updateAdminDto.contact

    const updatedClient = Object.assign(admin, updateAdminDto);
    this.cacheManager.del("/api/v1/admin")
    Object.values(roleType).map((item) => {
      this.cacheManager.del(`/api/v1/admin/by-dept?dept=${item}`)
    })
    return await this.adminRepository.save(updatedClient);
  }

  async updateProfile(id: string, profile: string): Promise<boolean> {
    const client = await this.adminRepository.findOne({ where: { id } });
    client.profile = profile;
    await this.adminRepository.save(client);
    return true;
  }

  async remove(id: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const admin = await this.adminRepository.findOne({ where: { id } });
      if (!admin) {
        throw new Error(`Admin with id ${id} not found.`);
      }
      await queryRunner.manager.remove(admin);
      const deleteResult = await this.authModel.deleteOne({ userID: id });
      if (deleteResult.deletedCount !== 1) {
        throw new Error(`Failed to delete auth record for userID ${id}.`);
      }
      await queryRunner.commitTransaction();
      this.cacheManager.del("/api/v1/admin")
      Object.values(roleType).map((item) => {
        this.cacheManager.del(`/api/v1/admin/by-dept?dept=${item}`)
      })
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}