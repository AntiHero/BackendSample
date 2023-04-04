import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersQueryRepository } from './infastructure/repositories/users.query-repository';
import { LoginUserHandler } from './app/commands/login-user/login-user.handler';
import { EmailManagerModule } from 'src/email-manager/email-manager.module';
import { USERS_QUERY_REPOSITORY_TOKEN } from 'src/@shared/constants';
import { AuthController } from './api/controllers/auth.controller';
import { HashingService } from './app/services/hashing.service';
import { BcryptService } from './app/services/bcrypt.service';
import { jwtConfig } from 'src/config/jwt.config';
import { ConfigModule } from '@nestjs/config';

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
    LoginUserHandler,
  ],
})
export class AuthModule {}
