import { type AuthToken } from '@prisma/client';
import { TokensPair } from 'src/auth/types/tokens-pair';

export abstract class TokensQueryRepositoryAdapter<O = AuthToken> {
  public abstract find(token: string): Promise<Partial<O> | null>;

  public abstract saveTokens(
    userId: string,
    tokens: TokensPair,
  ): Promise<void | null>;
}
