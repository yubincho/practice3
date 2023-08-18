import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus, HttpCode} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {CreateMemberDto} from "../member/dto/create-member.dto";
import {LoginMemberDto} from "../member/dto/login-member.dto";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {RequestWithUserInterface} from "./interfaces/requestWithUser.interface";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {EmailVerificationDto} from "../member/dto/email-verification.dto";
import {KakaoAuthGuard} from "./guards/kakao-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signupUser(createMemberDto: CreateMemberDto) {
    const user = await this.authService.registerUser(createMemberDto)
    return user
  }


  @Post('send/email')
  async sendEmail(@Body('email') email: string) {
    return await this.authService.sendEmail(email);
  }

  @Post('verify/email')
  async verifyEmail(@Body() emailVerificationDto: EmailVerificationDto) {
    const { email, code } = emailVerificationDto;
    return await this.authService.confirmEmailVerification(email, code);
  }

  @HttpCode(200)
  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoLoginCallback(@Req() req: RequestWithUserInterface) {
    const { user } = req;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async loginUser(@Req() req: RequestWithUserInterface) {
    const user = req.user
    const token = await this.authService.generateAccessToken(user.id)
    user.password = undefined
    return { user, token }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req: RequestWithUserInterface) {
    return req.user
  }


}
