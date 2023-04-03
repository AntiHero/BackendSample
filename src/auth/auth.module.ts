import { Module } from '@nestjs/common';

import { AuthController } from './api/controllers/auth.controller';

@Module({
  controllers: [AuthController],
})
export class AuthModule {}
