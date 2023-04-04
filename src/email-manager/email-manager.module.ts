import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { EmailService } from './email-manager.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('MAILER_HOST'),
            secure: false,
            auth: {
              user: configService.get<string>('MAILER_USER'),
              pass: configService.get<string>('MAILER_PASS'),
            },
          },
          defaults: {
            from: '"INCTAGRAM" <no-reply@inctagram.com>',
          },
          template: {
            adapter: new PugAdapter(),
            dir: process.cwd() + '/src/email-manager/templates',
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailManagerModule {}
