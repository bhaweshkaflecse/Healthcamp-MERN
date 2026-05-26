import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { packagePurchaseStatType, roleType as role } from 'src/helper/types/index.type';
import { RtGuard } from 'src/middlewares/refresh_token/rt.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';

@Controller('dashboard')
@ApiTags('Dashboard')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

 @Get('client')
  findClient() {
    return this.dashboardService.findClient();
  }

  @Get('business')
  findBusiness() {
    return this.dashboardService.findBusiness();
  }

  @Get('team')
  @UseGuards(AtGuard,RolesGuard)
  @Roles(role.teamLead)
  @ApiBearerAuth('access-token')
  findTeam(@Req() req:any) {
    const teamLeaderId=req.user.sub;
    return this.dashboardService.findTeam(teamLeaderId);
  }

  @Get('team/kyc')
  @UseGuards(AtGuard,RolesGuard)
  @Roles(role.teamLead)
  @ApiBearerAuth('access-token')
  findTeamKyc(@Req() req:any) {
    const teamLeaderId=req.user.sub;
    return this.dashboardService.findTeamKyc(teamLeaderId);
  }

  @Get('purchase-stat')
  @UseGuards(AtGuard,RolesGuard)
  @Roles(role.finance,role.businessHead)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'purchaseState', enum: packagePurchaseStatType })
 findPurchaseStat(@Query() query: { purchaseState: packagePurchaseStatType }) {
    return this.dashboardService.findPurchaseStat(query.purchaseState);
  }
}
