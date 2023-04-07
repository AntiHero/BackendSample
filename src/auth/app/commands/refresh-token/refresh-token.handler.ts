import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TokensService } from 'src/auth/app/services/tokens.service';
import { RefreshTokenCommand } from './refresh-token.command';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler {
  public constructor(private readonly tokensService: TokensService) {}

  public async execute(
    command: RefreshTokenCommand,
  ): Promise<[string, string]> {
    const { userId, email } = command;

    const [accessToken, refreshToken] =
      await this.tokensService.generateAcessAndRefreshTokens(userId, { email });

    await this.tokensService.saveTokens(userId, { accessToken, refreshToken });

    return [accessToken, refreshToken];
  }
}
