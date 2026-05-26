import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { teamEntity } from 'src/model/sql/team.entity';
import { ILike, Repository } from 'typeorm';
import { adminEntity } from 'src/model/sql/admin.entity';
import { AddMemberDto, CreateChangeTeamDto } from './dto/change-team.dto';
import { deptType, roleType } from 'src/helper/types/index.type';
import { subTeamEntity } from 'src/model/sql/subTeam.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(teamEntity)
    private readonly teamRepository: Repository<teamEntity>,

    @InjectRepository(adminEntity)
    private readonly adminRepository: Repository<adminEntity>,

    @InjectRepository(subTeamEntity)
    private readonly subTeamRepository: Repository<subTeamEntity>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Boolean> {
    const { name, description, teamLeaderId, memberIds } = createTeamDto;

    const teamLeader = this.adminRepository.create({ id: teamLeaderId });
    const admins = memberIds.map((id) => this.adminRepository.create({ id }));

    const team = new teamEntity();
    team.name = name;
    team.description = description;
    team.teamLeader = teamLeader;
    team.admin = admins;

    await this.teamRepository.save(team);
    return true;
  }

  async findAll(): Promise<teamEntity[]> {
    const teams = await this.teamRepository.find({
      relations: ['teamLeader', 'admin'],
      select: {
        id: true,
        name: true,
        description: true,
        teamLeader: {
          id: true,
          name: true,
          email: true,
          profile:true
        },
        admin: {
          id: true,
          profile: true,
        },
      },
    });
    return teams;
  }

  async findByTeamLeader(teamLeader: string): Promise<teamEntity[]> {
    const team = await this.teamRepository.find({
      where: {
        teamLeader: {
          name: ILike(`%${teamLeader}%`),
        },
      },
      relations: ['admin', 'teamLeader'],
      select: {
        id: true,
        name: true,
        description: true,
        admin: {
          id: true,
          name: true,
          profile: true,
        },
        teamLeader: {
          id: true,
          name: true,
          profile: true,
        },
      },
    });
    return team;
  }

 async findTeam(id:string){
   const team=await this.teamRepository.findOne({
    where:{teamLeader:{id}},
    relations:['admin','teamLeader'],
  });
   return team;
  }

  async findOne(id: string) {
    const team = await this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.admin', 'admin')
      .leftJoinAndSelect('team.teamLeader', 'teamLeader')
      .select([
        'team.id',
        'team.name',
        'team.description',
        'admin.id',
        'admin.name',
        'admin.profile',
        'admin.department',
        'admin.address',
        'teamLeader.id',
        'teamLeader.profile',
        'teamLeader.name',
        'teamLeader.email',
      ])
      .where('team.id = :id', { id })
      .getOne();
    return team;
  }

  async findMemberByRole(id: string, role: deptType) {
    const team = await this.teamRepository.findOne({
      where: { id, admin: { department: role } },
      relations: ['admin.subTeam'],
      select: {
        id:true,
        admin: {
          id: true,
          name: true,
          profile:true,
          department:true,
          subTeam:{
            id:true
          }
        },
      },
    });
  
    // console.log(team);
    // return team;
    if(!team){
      return []
    }
    const excludeRoles:deptType[]=[deptType.finance,deptType.sales,deptType.dataEntry];
    const filteredMembers=excludeRoles.includes(role)?
    team.admin:
    team.admin.filter((item:any)=>item.subTeam.length==0);
    // console.log(filteredMembers)
    return filteredMembers.map(({ id, name, profile }) => ({ id, name, profile })) 
  }

 async findMemberByTeam(id:string){
  const members = await this.teamRepository.findOne({
    where: { id},
    relations: ['admin'],
    select: {
      admin: {
        id: true,
        name: true,
        profile:true,
        department:true
      },
    },
  });
  return members

  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const team = await this.teamRepository.findOne({ where: { id } });
    const updatedTeam = Object.assign(team, updateTeamDto);
    await this.teamRepository.save(updatedTeam);
    return { success: true, msg: 'team updated' };
  }

  async addMember(teamId: string,AddMemberDto:AddMemberDto) {
    const {memberId}=AddMemberDto;
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['admin'],
    });
    // console.log(team)
    if (!team.admin) {
      team.admin = [];
    }
    memberId.forEach(async(member)=>{
      const isAdminAlreadyInTeam = team.admin.some(
        (existingAdmin) => (existingAdmin.id === member  ),
      );
      // console.log(isAdminAlreadyInTeam)
      if(!isAdminAlreadyInTeam){
        const admin = await this.adminRepository.findOne({
          where: { id: member },
        });
        team.admin.push(admin);
      }
    })
   
    await this.teamRepository.save(team);
    return { success: true, msg: 'Member added' };
  }

  async changeTeam(createChangeTeam: CreateChangeTeamDto) {
    const team = await this.teamRepository.findOne({
      where: { id: createChangeTeam.teamId },
      relations: ['admin'],
    });
    const adminIndex = team.admin.findIndex(
      (admin) => admin.id === createChangeTeam.memberId,
    );
    if (adminIndex === -1) {
      throw new Error('Admin not found in the specified team');
    }
    const admin = team.admin[adminIndex];
    team.admin.splice(adminIndex, 1);
    const nextTeam = await this.teamRepository.findOne({
      where: { id: createChangeTeam.nextTeamId },
      relations: ['admin'],
    });
    if (!nextTeam.admin) {
      nextTeam.admin = [];
    }
    const isAdminAlreadyInTeam = nextTeam.admin.some(
      (existingAdmin) => existingAdmin.id === createChangeTeam.memberId,
    );
    if (isAdminAlreadyInTeam) {
      throw new ForbiddenException('member already exist');
    }

    nextTeam.admin.push(admin);
    const subTeam = await this.subTeamRepository.findOne({
      where: { team: { id: createChangeTeam.teamId } },
      relations: ['admin'],
    });
    if (subTeam != null) {
      subTeam.admin = subTeam.admin.filter(
        (admin) => admin.id !== createChangeTeam.memberId,
      );
      await this.subTeamRepository.save(subTeam);
    }
    await this.teamRepository.save(nextTeam);
    await this.teamRepository.save(team);
    return { success: true, msg: 'team changed' };
  }

  async removeMember(teamId: string, adminId: string) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['admin'],
    });
    team.admin = team.admin.filter((admin) => admin.id !== adminId);
    await this.teamRepository.save(team);
    return { success: true, msg: 'Member removed' };
  }

  async changeLeader(teamId: string, leaderId: string) {
    // const team = await this.teamRepository.findOne({
    //   where: { id: teamId },
    //   relations: ['teamLeader'],
    // });
    // const teamLeader = this.adminRepository.create({ id: leaderId });
    // team.teamLeader = teamLeader;
    // await this.teamRepository.save(team);
    await this.teamRepository.update({id:teamId},{teamLeader:{id:leaderId}})
    return { success: true, msg: 'Team Leader changed' };
  }

  async removeLeader(id: string) {
    const team = await this.teamRepository.findOne({ where: { id } });
    team.teamLeader = null;
    await this.teamRepository.save(team);
    return { success: true, msg: 'team leader has been deleted' };
  }

  async remove(id: string) {
    const team = await this.teamRepository.findOne({ where: { id } });
    await this.teamRepository.remove(team);
    return { success: true, msg: 'team has been deleted' };
  }
}
