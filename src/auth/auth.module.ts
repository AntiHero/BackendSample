import { Module } from '@nestjs/common';

import { AuthController } from './api/controllers/auth.controller';
import { HashingService } from './app/services/hashing.service';
import { BcryptService } from './app/services/bcrypt.service';

@Module({
  controllers: [AuthController],
  providers: [{ provide: HashingService, useClass: BcryptService }],
})
export class AuthModule {}
