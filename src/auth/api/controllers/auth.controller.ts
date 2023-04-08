import { CommandBus } from '@nestjs/cqrs';
import { Request, Response } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { ConfirmRegistrationCommand } from 'src/auth/app/commands/confirm-registration/confirm-registration.command';
import { UseresQueryRepositoryAdapter } from 'src/@shared/adapters/users.query-repository-adapter';
import { RegisterUserCommand } from 'src/auth/app/commands/register-user/register-user.command';
import { RefreshTokenCommand } from 'src/auth/app/commands/refresh-token/refresh-token.command';
import { LoginUserCommand } from 'src/auth/app/commands/login-user/login-user.command';
import { JwtCookieGuard } from 'src/auth/@common/guards/jwt-cookie.guard';
import { RegistrationDto } from 'src/auth/api/dtos/registration.dto';
import { UserWithRelativeInfo } from 'src/@shared/types';
import { LoginDto } from 'src/auth/api/dtos/login.dto';
import { CodeDto } from 'src/auth/api/dtos/code.dto';
import { UserDto } from 'src/auth/app/dtos/user.dto';
import { API } from 'src/@shared/constants';
import 'src/global';

@Controller(API.AUTH)
export class AuthController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UseresQueryRepositoryAdapter<
      UserDto,
      UserWithRelativeInfo | null
    >,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post(API.LOGIN)
  public async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = loginDto;
    const [accessToken, refreshToken] = await this.commandBus.execute(
      new LoginUserCommand(email, password),
    );

    response.cookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });

    response.status(200).json({ accessToken });
  }

  @Post(API.REGISTRATION)
  public async registration(@Body() registrationDto: RegistrationDto) {
    const { email, password } = registrationDto;

    return this.commandBus.execute(new RegisterUserCommand(email, password));
  }

  @Post(API.CONFIRM_REGISTRATION)
  public async confirmRegistration(@Body() confirmRegistrationDto: CodeDto) {
    const { code } = confirmRegistrationDto;

    return this.commandBus.execute(new ConfirmRegistrationCommand(code));
  }

  /**
   *  1. validate refreshToken in cookie [x]
   *  2. find user by userId in db [x]
   *  3. create new pair of access token and refhres-token [x]
   *  4. update tokens table with valid tokens for issuer
   */
  @UseGuards(JwtCookieGuard)
  @Post(API.REFRESH_TOKEN)
  public async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.user) throw new UnauthorizedException();

    const { userId } = request.user;

    if (!userId) throw new UnauthorizedException();

    const user = await this.usersQueryRepository.findById(userId);

    if (!user) throw new UnauthorizedException();

    const [accessToken, refreshToken] = await this.commandBus.execute(
      new RefreshTokenCommand(user.id, user.email),
    );

    response.cookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });

    response.status(200).json({ accessToken });
  }

  @Post(API.RESEND_REGISTRATION_CONFIRMATION)
  public async resendRegistrationConfirmation() {
    return null;
  }

  @Post(API.PASSWORD_RECOVERY)
  public async passwordRecovery() {
    return null;
  }

  @Post(API.NEW_PASSWORD)
  public async newPassword() {
    return null;
  }

  @Post(API.LOGOUT)
  public async logout() {
    return null;
  }
}
