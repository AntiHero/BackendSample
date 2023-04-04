import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { QueryRepository } from 'src/auth/infastructure/repositories/query-repository';
import { USERS_QUERY_REPOSITORY_TOKEN } from 'src/@shared/constants';
import { HashingService } from 'src/auth/app/services/hashing.service';
import { LoginUserCommand } from './login-user.command';
import { UserDto } from 'src/auth/app/dtos/user.dto';
import { jwtConfig } from 'src/config/jwt.config';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  public constructor(
    @Inject(USERS_QUERY_REPOSITORY_TOKEN)
    private readonly usersQueryRepository: QueryRepository<
      UserDto,
      User | null
    >,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  private async signToken<T>(id: string, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: id,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  public async execute(command: LoginUserCommand) {
    const { email, password } = command;

    const user = await this.usersQueryRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const isPasswordCorrect = await this.hashingService.compare(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('User does not exist');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {
        email,
      }),
      ,
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        email,
      }),
    ]);

    return [accessToken, refreshToken];
  }
}
