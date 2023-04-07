import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfirmRegistrationHandler } from './app/commands/confirm-registration/confirmat-registration.handler';
import { TokensQueryRepositoryAdapter } from 'src/@shared/adapters/tokens.query-repository-adapter';
import { UseresQueryRepositoryAdapter } from 'src/@shared/adapters/users.query-repository-adapter';
import { UsersQueryRepository } from './infastructure/repositories/users.query-repository';
import { RegisterUserHandler } from './app/commands/register-user/register-user.handler';
import { RefreshTokenHandler } from './app/commands/refresh-token/refresh-token.handler';
import { UsersRepositoryAdapter } from 'src/@shared/adapters/users.repository-adapter';
import { TokensQueryRepository } from './infastructure/repositories/tokens.repostiory';
import { LoginUserHandler } from './app/commands/login-user/login-user.handler';
import { UsersRepository } from './infastructure/repositories/users.repository';
import { EmailManagerModule } from 'src/email-manager/email-manager.module';
import { AuthController } from './api/controllers/auth.controller';
import { JwtCookieGuard } from './@common/guards/jwt-cookie.guard';
import { JwtCookieStrategy } from './api/strategies/jwt.strategy';
import { HashingService } from './app/services/hashing.service';
import { BcryptService } from './app/services/bcrypt.service';
import { TokensService } from './app/services/tokens.service';
import { jwtConfig } from 'src/config/jwt.config';

const commandHandlers = [
  LoginUserHandler,
  RegisterUserHandler,
  ConfirmRegistrationHandler,
  RefreshTokenHandler,
];

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
    { provide: UseresQueryRepositoryAdapter, useClass: UsersQueryRepository },
    { provide: UsersRepositoryAdapter, useClass: UsersRepository },
    { provide: TokensQueryRepositoryAdapter, useClass: TokensQueryRepository },
    ...commandHandlers,
    TokensService,
    JwtCookieGuard,
    JwtCookieStrategy,
  ],
})
export class AuthModule {}
