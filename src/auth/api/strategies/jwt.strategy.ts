import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { type TokenPayload } from 'src/auth/types/token.payload';

const cookieExtractor = (req: Request) => {
  if (req && req.cookies) {
    return req.cookies['refreshToken'];
  }

  return null;
};

export const JWT_COOKIE_STRATEGY = 'cookie';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  JWT_COOKIE_STRATEGY,
) {
  public constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate<T extends TokenPayload & { sub: string }>(payload: T) {
    console.log(payload);
    return { userId: payload.sub, email: payload.email };
  }
}
