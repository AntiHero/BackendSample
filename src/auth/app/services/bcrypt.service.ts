import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { HashingService } from './hashing.service';

@Injectable()
export class BcryptService implements HashingService {
  private saltRounds = 10;

  public async hash(data: string | Buffer): Promise<string> {
    return bcrypt.hash(data, this.saltRounds);
  }

  public async compare(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
