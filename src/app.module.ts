import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { configValidationSchema } from './config/config.validation-schema';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
