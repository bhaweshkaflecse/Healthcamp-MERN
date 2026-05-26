import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateSubteamDto } from './dto/create-subteam.dto';
import { UpdateSubteamDto } from './dto/update-subteam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { subTeamEntity } from 'src/model/sql/subTeam.entity';
import { Repository } from 'typeorm';
import { adminEntity } from 'src/model/sql/admin.entity';
import { customEntity } from 'src/model/sql/customMember.entity';
import { teamEntity } from 'src/model/sql/team.entity';
import { eventStatus } from 'src/helper/types/index.type';

@Injectable()
export class SubteamService {
  constructor(
    @InjectRepository(subTeamEntity)
    private readonly subTeamRepository: Repository<subTeamEntity>,

    @InjectRepository(adminEntity)
    private readonly adminRepository: Repository<adminEntity>,

    @InjectRepository(customEntity)
    private readonly customRepository: Repository<customEntity>,

    @InjectRepository(teamEntity)
    private readonly teamRepository: Repository<teamEntity>,
  ) {}
  async create(id: string, createSubteamDto: CreateSubteamDto) {
    const { name, description, serviceId, memberIds } = createSubteamDto;
    const admins = memberIds.map((id, index) => {
      const member = this.adminRepository.create({ id });
      return member;
    });
    const subTeam = this.subTeamRepository.create({
      name,
      description,
      service: { id: serviceId },
      team: { id },
      admin: admins,
      custom: null,
    });
    await this.subTeamRepository.save(subTeam);
    return true;
  }

  async addCustom(subTeamId: string, customId: string) {
    const subTeam = await this.subTeamRepository.findOne({
      where: { id: subTeamId },
      relations: ['custom'],
    });
    if (!subTeam) {
      throw new ForbiddenException('subteam not found');
    }
    const custom = await this.customRepository.findOne({
      where: { id: customId },
    });
    const isCustomAlreadyInTeam = subTeam.custom.some(
      (existingAdmin) => existingAdmin.id === customId,
    );

    if (isCustomAlreadyInTeam) {
      throw new ForbiddenException('member already exist');
    }
    subTeam.custom.push(custom);
    await this.subTeamRepository.save(subTeam);
    return { success: true, msg: 'custom Member added' };
  }

  async addMember(subTeamId: string, customId: string) {
    const subTeam = await this.subTeamRepository.findOne({
      where: { id: subTeamId },
      relations: ['admin'],
    });
    const custom = await this.adminRepository.findOne({
      where: { id: customId },
    });
    const isCustomAlreadyInTeam = subTeam.admin.some(
      (existingAdmin) => existingAdmin.id === customId,
    );

    if (isCustomAlreadyInTeam) {
      throw new ForbiddenException('member already exist');
    }
    subTeam.admin.push(custom);
    await this.subTeamRepository.save(subTeam);
    return { success: true, msg: 'Member added' };
  }

  async removeMember(teamId: string, customId: string) {
    const team = await this.subTeamRepository.findOne({
      where: { id: teamId },
      relations: ['custom', 'admin'],
    });
    team.custom = team.custom.filter((member) => member.id !== customId);
    team.admin = team.admin.filter((member) => member.id !== customId);
    await this.subTeamRepository.save(team);
    return { success: true, msg: 'Member removed' };
  }

  async findAllByService(teamId: string, serviceId: string) {
    const subTeams = await this.subTeamRepository.find({
      where: {
        team: { id: teamId },
        service: { id: serviceId },
      },
      select: ['id', 'name'],
    });
    return subTeams;
  }

  async findOne(id: string) {
    const subTeam = await this.subTeamRepository.findOne({
      where: { id },
      relations: ['custom', 'admin', 'team', 'team.teamLeader', 'service'],
      select: {
        id: true,
        name: true,
        description: true,
        team: {
          id: true,
          name: true,
          teamLeader: {
            id: true,
            profile: true,
            name: true,
            email: true,
            department: true,
          },
        },
        admin: {
          id: true,
          name: true,
          profile:true,
          department: true,
          address: true,
        },
        service: {
          id: true,
          name: true,
        },
      },
    });
    return subTeam;
  }

  async subteamByService(serviceId: string) {
    const subTeams = await this.subTeamRepository.find({
      where: {
        service: { id: serviceId },
        isAssigned: false,
      },
      select: ['id', 'name'],
    });
    return subTeams;
  }

  async findByTeam(id: string, serviceId: string) {
    const subTeams = await this.subTeamRepository.find({
      where: {
        team: { teamLeader: { id } },
        service: { id: serviceId },
        isAssigned: false,
      },
      select: ['id', 'name'],
    });
    return subTeams;
  }

  async update(id: string, updateSubteamDto: UpdateSubteamDto) {
    const subTeam = await this.subTeamRepository.findOne({ where: { id } });
    const updatedTeam = Object.assign(subTeam, updateSubteamDto);
    await this.subTeamRepository.save(updatedTeam);
    return true;
  }

  async remove(id: string) {
    const subTeam = await this.subTeamRepository.findOne({ where: { id } });
    await this.subTeamRepository.remove(subTeam);
    return true;
  }
}
