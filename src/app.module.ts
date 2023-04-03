import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { configValidationSchema } from './config/config.validation-schema';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
