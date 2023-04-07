import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';

import { UseresQueryRepositoryAdapter } from 'src/@shared/adapters/users.query-repository-adapter';
import { HashingService } from 'src/auth/app/services/hashing.service';
import { TokensService } from 'src/auth/app/services/tokens.service';
import { UserWithRelativeInfo } from 'src/@shared/types';
import { LoginUserCommand } from './login-user.command';
import { UserDto } from 'src/auth/app/dtos/user.dto';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  public constructor(
    private readonly usersQueryRepository: UseresQueryRepositoryAdapter<
      UserDto,
      UserWithRelativeInfo | null
    >,
    private readonly hashingService: HashingService,
    private readonly tokensService: TokensService,
  ) {}

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

    const [accessToken, refreshToken] =
      await this.tokensService.generateAcessAndRefreshTokens(user.id, {
        email,
      });

    await this.tokensService.saveTokens(user.id, { accessToken, refreshToken });

    return [accessToken, refreshToken];
  }
}
