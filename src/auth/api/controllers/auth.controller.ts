import { Controller, Post } from '@nestjs/common';
import { API } from 'src/@shared/constants';

@Controller(API.AUTH)
export class AuthController {
  @Post(API.LOGIN)
  public async login() {
    return null;
  }

  @Post(API.REGISTRATION)
  public async registration() {
    return null;
  }

  @Post(API.CONFIRM_REGISTRATION)
  public async confirmRegistration() {
    return null;
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
