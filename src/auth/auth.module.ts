import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfirmRegistrationHandler } from './app/commands/confirm-registration/confirmat-registration.handler';
import { UsersQueryRepository } from './infastructure/repositories/users.query-repository';
import { RegisterUserHandler } from './app/commands/register-user/register-user.handler';
import { LoginUserHandler } from './app/commands/login-user/login-user.handler';
import { UsersRepository } from './infastructure/repositories/users.repository';
import { EmailManagerModule } from 'src/email-manager/email-manager.module';
import { AuthController } from './api/controllers/auth.controller';
import { HashingService } from './app/services/hashing.service';
import { BcryptService } from './app/services/bcrypt.service';
import { jwtConfig } from 'src/config/jwt.config';
import {
  USERS_QUERY_REPOSITORY_TOKEN,
  USERS_REPOSITORY_TOKEN,
} from 'src/@shared/constants';

@Module({
  imports: [
    CqrsModule,
    EmailManagerModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    { provide: USERS_QUERY_REPOSITORY_TOKEN, useClass: UsersQueryRepository },
    { provide: USERS_REPOSITORY_TOKEN, useClass: UsersRepository },
    LoginUserHandler,
    RegisterUserHandler,
    ConfirmRegistrationHandler,
  ],
})
export class AuthModule {}
