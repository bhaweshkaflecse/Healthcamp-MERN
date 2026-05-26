import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, BadRequestException, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDTO } from './dto/signInDTO';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RtGuard } from 'src/middlewares/refresh_token/rt.guard';
import { MailToken, resetPasswordDTO, updatePasswordDTO } from './dto/forget-password.dto';
import { generateOtpDTO } from './dto/generateOTP.dto';
import { verifyOtpDTO } from './dto/verifyOTP.dto';
import { otpRequestType } from 'src/helper/types/index.type';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("signin")
  @ApiQuery({ name: 'user', required: true, description: 'provide either admin or client', type: String })
  async signIn(@Body() body: signInDTO, @Query('user') user: 'client' | 'admin') {
    if (user === 'admin') {
      return this.authService.signInAdmin(body);
    } else if (user === 'client') {
      return this.authService.signInClient(body);
    } else {
      throw new BadRequestException("Invalid query")
    }
  }

  @Patch('signout')
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Logout" })
  @UseGuards(AtGuard)
  signOut(@Req() req) {
    const { user } = req;
    return this.authService.signOut(user.sub);
  }

  @Post('forget-password')
  @ApiQuery({ name: 'user', required: true, description: 'provide either admin or client', type: String })
  async forgetPassword(@Body() body: MailToken, @Query('user') user: 'client' | 'admin') {
    if (user === 'admin') {
      return this.authService.forgetPasswordAdmin(body);
    } else if (user === 'client') {
      // console.log(body);
      return this.authService.forgetPasswordClient(body);
    } else {
      throw new BadRequestException("Invalid query")
    }
  }

  
  @Patch('update-password')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  async updatePassword(@Body() body: updatePasswordDTO, @Req() req: any) {
    const id = req.user.sub;
    return this.authService.updatePassword(body, id)
  }

  @Patch('reset-password')
  @ApiBearerAuth('access-token')
  async resetPassword(@Body() body: resetPasswordDTO) {
    return this.authService.resetToken(body)
  }

  @Post('refresh-token')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Generate access token" })
  @UseGuards(RtGuard)
  async refrshToken(@Req() req) {
    const { user } = req
    return this.authService.refreshTokenAdmin(user);
    // console.log(req.headers);
    // if (user === 'admin') {
    // } else if (user === 'client') {
    //   // return this.authService.signInClient(body);
    // } else {
    //   throw new BadRequestException("Invalid query")
    // }
  }
  @Post('generate-OTP')
  @ApiQuery({ name: 'authPurpose' })
  generateOTP(@Body() body: generateOtpDTO, @Query() query: { authPurpose: otpRequestType }) {
    return this.authService.generateOTP(body.email, query.authPurpose);
  }

  @Post('verify-otp')
  update(@Body() body: verifyOtpDTO) {
    return this.authService.veriyOTP(body.email, +body.otp);
  }

  @Get('get-my-info')
  @UseGuards(RtGuard)
  async getMyInfo(@Req() req) {
    const { user } = req;
    return this.authService.getMyInfo(user)
  }
}