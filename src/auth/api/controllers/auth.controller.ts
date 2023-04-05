import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';

import { RegisterUserCommand } from 'src/auth/app/commands/register-user/register-user.command';
import { LoginUserCommand } from 'src/auth/app/commands/login-user/login-user.command';
import { RegistrationDto } from 'src/auth/api/dtos/registration.dto';
import { LoginDto } from 'src/auth/api/dtos/login.dto';
import { API } from 'src/@shared/constants';
import { ConfirmRegistrationCommand } from 'src/auth/app/commands/confirm-registration/confirm-registration.command';
import { CodeDto } from '../dtos/code.dto';

@Controller(API.AUTH)
export class AuthController {
  public constructor(private readonly commandBus: CommandBus) {}

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

  @Post(API.REFRESH_TOKEN)
  public async refreshToken() {
    return null;
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
