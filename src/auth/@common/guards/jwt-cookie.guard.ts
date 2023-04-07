import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { TokensQueryRepositoryAdapter } from 'src/@shared/adapters/tokens.query-repository-adapter';
import { JWT_COOKIE_STRATEGY } from 'src/auth/api/strategies/jwt.strategy';

@Injectable()
export class JwtCookieGuard extends AuthGuard(JWT_COOKIE_STRATEGY) {
  public constructor(
    private readonly tokensQueryRepository: TokensQueryRepositoryAdapter,
  ) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();

    const { refreshToken } = request.cookies;

    if (!refreshToken) throw new UnauthorizedException();

    const isTokenInDb = await this.tokensQueryRepository.find(refreshToken);

    if (!isTokenInDb) throw new UnauthorizedException();

    return super.canActivate(context);
  }

  public handleRequest<Err, U>(err: Err, user: U) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    return { ...user, bla: 1 };
  }
}
