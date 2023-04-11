import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { EmailService } from './email-manager.service';
import { randomUUID } from 'crypto';

const mailerServiceMock = {
  sendMail: jest.fn(),
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let emailService: EmailService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: mailerServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    emailService = app.get(EmailService);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should send confirmation email with code', async () => {
    const email = 'sample@gmail.com';
    const code = randomUUID();

    await emailService.sendRegistrationConfirmation(email, code);

    expect(mailerServiceMock.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: email,
        context: {
          confirmationLink: expect.stringContaining(code),
        },
      }),
    );
  });
});
