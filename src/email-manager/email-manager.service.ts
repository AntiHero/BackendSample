import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  public constructor(private readonly mailerService: MailerService) {}

  public async sendRegistrationConfirmation(email: string, code: string) {
    const confirmationLink = `localhost:9000?code=${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Registration Confirmation',
      template: 'registration-confirmation',
      context: {
        confirmationLink,
      },
    });
  }
}
