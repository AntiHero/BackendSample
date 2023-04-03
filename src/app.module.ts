import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { configValidationSchema } from './config/config.validation-schema';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
