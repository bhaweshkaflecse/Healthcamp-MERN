import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { signInDTO } from './dto/signInDTO';
import { Token } from 'src/helper/utils/token';
import { hash } from 'src/helper/utils/hash';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, authDocument } from 'src/model/mongo/auth.schema';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { adminEntity } from 'src/model/sql/admin.entity';
import { MailToken, resetPasswordDTO, updatePasswordDTO } from './dto/forget-password.dto';
import { sendMail } from 'src/config/mail.config';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, roleType } from 'src/helper/types/index.type';
import { Cache } from 'cache-manager';
import { clientEntity } from 'src/model/sql/client.entity';

@Injectable()
export class AuthService {
  constructor(
    private Token: Token,
    private hash: hash,
    private readonly jwtService: JwtService,
    private configService: ConfigService,

    @InjectModel(Auth.name)
    private authModel: Model<authDocument>,

    @InjectRepository(adminEntity)
    private adminRepository: Repository<adminEntity>,

    @InjectRepository(clientEntity)
    private clientRepository: Repository<clientEntity>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async signInAdmin(body: signInDTO) {
  const existingAdmin = await this.adminRepository.findOne({
      where: { email:body.email },
    });
    
    if (!existingAdmin) {
      throw new UnauthorizedException("Credential doesn't match")
    } else {
      const existingAuth = await this.authModel.findOne({ userID: existingAdmin.id })
      if (!existingAuth) {
        throw new UnauthorizedException("Credential doesn't match")
      } else {
        const status = await this.hash.verifyHashing(existingAuth.password, body.password)
        if (!status) {
          throw new UnauthorizedException("Credential doesn't match")
        }
        const tokens = {
          acessToken: await this.Token.generateAcessToken({ sub: existingAdmin.id, role: existingAdmin.department }),
          refreshToken: await this.Token.generateRefreshToken({ sub: existingAdmin.id, role: existingAdmin.department }),
          role: existingAdmin.department
        }
        existingAuth.rToken = await this.hash.value(tokens.refreshToken)
        await existingAuth.save()
        return tokens
      }
    }
  }
  async signInClient(body: signInDTO) {
    console.log(body)
    const existingAdmin = await this.clientRepository.findOne({ 
      where: { email: body.email }
     })
    console.log(existingAdmin)
    if (!existingAdmin) {
      throw new UnauthorizedException("Credential doesn't match")
    } else {
      const existingAuth = await this.authModel.findOne({ userID: existingAdmin.id })
      console.log(existingAuth)
      if (!existingAuth) {
        throw new UnauthorizedException("Credential doesn't match")
      } else {
        const status = await this.hash.verifyHashing(existingAuth.password, body.password)
        console.log(status)
        if (!status) {
          throw new UnauthorizedException("Credential doesn't match")
        }
        const tokens = {
          acessToken: await this.Token.generateAcessToken({ sub: existingAdmin.id, role: "client" }),
          refreshToken: await this.Token.generateRefreshToken({ sub: existingAdmin.id, role: "client" })
        }
        existingAuth.rToken = await this.hash.value(tokens.refreshToken);
        await existingAuth.save();
        return tokens
      }
    }
  }

  async signOut(id: string): Promise<boolean> {
    const existingData = await this.authModel.findOne({ userID: id })
    if (!existingData) {
      throw new UnauthorizedException()
    }
    existingData.rToken = null
    await existingData.save()
    return true
  }

  async forgetPasswordAdmin(body: MailToken): Promise<boolean> {
    const existingUser = await this.adminRepository.findOne({ where: { email: body.email } })
    if (!existingUser) {
      throw new NotFoundException("Email doesn't exist.")
    }
    const authDta = await this.authModel.findOne({ userID: existingUser.id })
    // console.log(authDta);
    if (authDta) {
      const token = await this.Token.generateUtilToken({ email: body.email, id: authDta.id })
      const frontURL = `${process.env.Healthcamp_Front}/update-password/${token}`
      try {
        sendMail(
          body.email,
          'Reset your password',
          `<h1>Please click this link to change your password</h1> ${frontURL}`,
        );
      } catch (error) {
        throw error
      }
      return true
    }
    return false
  }

  async forgetPasswordClient(body: MailToken): Promise<boolean> {

    const existingUser = await this.clientRepository.findOne({ where: { email: body.email } })
    if (!existingUser) {
      throw new NotFoundException("Email doesn't exist.")
    }
    const authDta = await this.authModel.findOne({ userID: existingUser.id })
    if (authDta) {
      const token = await this.Token.generateUtilToken({ email: body.email, id: authDta.id })
      const frontURL = `${process.env.Healthcamp_Client}/update-password/${token}`
      try {
        sendMail(
          body.email,
          'Reset your password',
          `<h1>Please click this link to change your password</h1> ${frontURL}`
        );
      } catch (error) {
        throw error
      }
      return true
    }
    return false
  }


  async updatePassword(body: updatePasswordDTO, userId: string) {
    const existingData = await this.authModel.findOne({ userID: userId });

    if (!existingData) {
      throw new ForbiddenException()
    }
    const status = await this.hash.verifyHashing(existingData.password, body.oldPassword)
    if (!status) {
      throw new UnauthorizedException("Credential doesn't match")
    }
    existingData.password = await this.hash.value(body.password)
    await existingData.save()
    return true
  }

  async resetToken(body: resetPasswordDTO) {
    const { token, email, password } = body;
    // console.log(body)
    let decodedToken;
    try {
      decodedToken = await this.jwtService.verify(token, { secret: process.env.UTIL_SECRET });
      // console.log("decodedToken:",decodedToken)
    } catch (err) {
      throw new ForbiddenException("Token malformed or expired.");
    }

    const { email: tokenEmail, id } = decodedToken;
    if (tokenEmail !== email) {
      throw new BadRequestException("Unrecognized user request.");
    }
    const existingData = await this.authModel.findOne({ _id: id });
    // console.log("existingData", existingData);
    if (!existingData) {
      throw new ForbiddenException("Unrecognized user request.");
    }

    existingData.password = await this.hash.value(password);
    await existingData.save();
    return true;
  }

  async refreshTokenAdmin(user) {
    if (user.role === 'client') {
      return await this.Token.generateAcessToken({ sub: user.sub, role: user.role })
    } else {
      const activeAdmin = this.adminRepository.findOne({ where: { id: user.sub } })
      if (activeAdmin) {
        return await this.Token.generateAcessToken({ sub: user.sub, role: user.role })
      }
    }
  }

  async validateRToken(token, id, role): Promise<boolean> {
    const checkData = await this.authModel.findOne({ userID: id })
    if (!checkData) {
      return false
    }
    const compareToken = await this.hash.verifyHashing(checkData.rToken, token)
    return compareToken
  }


  async generateOTP(email, isAuthPurpose) {
    if (isAuthPurpose) {
      const authUser = await this.clientRepository.findOne({ where: { email } });
      if (authUser) {
        throw new ForbiddenException("Email already exist");
      }
    }

    const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const otpData = { email, otp, createdAt: Date.now() };
    const otpKey = `otp:${email}`;
    const msg = `
              <h3>${otp}</h3>
              <p>Don't share this otp to others.</P>
              <p>Thank you.</p>
              `;
    sendMail(email, 'Transactional OTP', msg);
    await this.cacheManager.set(otpKey, otpData, 1000 * 60 * 20);
    console.log(`otp:${otp}`);
    return { success: true, msg: 'otp sent' };

  }

  async veriyOTP(email: string, otp) {
    const existingData: { email: string; otp: string, createdAt: string } = await this.cacheManager.get(`otp:${email}`)
    if (!existingData) {
      return false
    }
    const currentTime = Date.now();
    const elapsedTimeInSeconds = (currentTime - (+existingData.createdAt)) / 1000;
    if (elapsedTimeInSeconds < 300) {
      return existingData.otp === otp
    } else {
      throw new RequestTimeoutException("OTP has expired")
    }
  }

  async getMyInfo(user: JwtPayload) {
    if (user.role === "client") {
      const myInfo = this
      return myInfo
    } else {
      const res = await this.adminRepository.findOne({ where: { id: user.sub } })
      return { ...res, role: "admin" }
    }
  }
}
