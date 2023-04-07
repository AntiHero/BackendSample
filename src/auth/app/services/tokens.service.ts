import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokensQueryRepositoryAdapter } from 'src/@shared/adapters/tokens.query-repository-adapter';

import { type TokenPayload } from 'src/auth/types/token.payload';
import { TokensPair } from 'src/auth/types/tokens-pair';
import { jwtConfig } from 'src/config/jwt.config';

@Injectable()
export class TokensService {
  public constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly tokensQueryRepository: TokensQueryRepositoryAdapter,
  ) {}

  public async signToken<T extends TokenPayload>(
    id: string,
    expiresIn: number,
    payload?: T,
  ) {
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

  public async generateAcessAndRefreshTokens(
    id: string,
    payload: TokenPayload,
  ) {
    const { email } = payload;

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(id, this.jwtConfiguration.accessTokenTtl, {
        email,
      }),
      this.signToken(id, this.jwtConfiguration.refreshTokenTtl, {
        email,
      }),
    ]);

    return [accessToken, refreshToken];
  }

  public async saveTokens(id: string, tokens: TokensPair) {
    return this.tokensQueryRepository.saveTokens(id, tokens);
  }
}
