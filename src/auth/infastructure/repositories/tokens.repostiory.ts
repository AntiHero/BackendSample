import { Injectable } from '@nestjs/common';

import { TokensQueryRepositoryAdapter } from 'src/@shared/adapters/tokens.query-repository-adapter';
import { TokensPair } from 'src/auth/types/tokens-pair';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokensQueryRepository extends TokensQueryRepositoryAdapter {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async find(token: string): Promise<{ id: string } | null> {
    try {
      return this.prismaService.authToken.findFirst({
        where: {
          OR: [
            {
              accessToken: token,
            },
            {
              refreshToken: token,
            },
          ],
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async saveTokens(
    userId: string,
    tokens: TokensPair,
  ): Promise<void | null> {
    const { accessToken, refreshToken } = tokens;
    try {
      await this.prismaService.authToken.upsert({
        where: { userId },
        update: {
          accessToken,
          refreshToken,
        },
        create: {
          userId,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
