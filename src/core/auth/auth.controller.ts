import { Body, Controller, Post, Get, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../common/guard/decorator/public.decorator';
import { SignUpDto, LoginDto } from './dto/auth.dto';
import type { Request, Response } from 'express';
import { AppResponse } from '../../common/util/app-response.parser';
import { SwaggerSignUp, SwaggerLogin, SwaggerGetProfile } from './auth.swagger';
import { AUTH_CONSTANTS } from '../../common/constants/auth.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @SwaggerSignUp()
  @Post('signup')
  async signUp(
    @Res() res: Response,
    @Body() signUpDto: SignUpDto,
  ): Promise<Response> {
    const data = await this.authService.signUp(signUpDto);

    return res
      .status(HttpStatus.CREATED)
      .json(AppResponse.success(AUTH_CONSTANTS.USER_CREATED, HttpStatus.CREATED, data));
  }

  @Public()
  @SwaggerLogin()
  @Post('login')
  async login(
    @Res() res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<Response> {
    const data = await this.authService.login(loginDto);

    return res
      .status(HttpStatus.OK)
      .json(AppResponse.success(AUTH_CONSTANTS.LOGIN_SUCCESS, HttpStatus.OK, data));
  }

  @SwaggerGetProfile()
  @Get('profile')
  async getProfile(
    @Res() res: Response,
    @Req() req: any,
  ): Promise<Response> {
    const data = await this.authService.getProfile(req.user.sub);

    return res
      .status(HttpStatus.OK)
      .json(AppResponse.success('Profile retrieved successfully', HttpStatus.OK, data));
  }
}
