import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ConflictException,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';

import { UseresQueryRepositoryAdapter } from 'src/@shared/adapters/users.query-repository-adapter';
import { UsersRepositoryAdapter } from 'src/@shared/adapters/users.repository-adapter';
import { EmailService } from 'src/email-manager/email-manager.service';
import { HashingService } from 'src/auth/app/services/hashing.service';
import { RegisterUserCommand } from './register-user.command';
import { type UserWithRelativeInfo } from 'src/@shared/types';
import { UserDto } from 'src/auth/app/dtos/user.dto';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private readonly usersQueryRepository: UseresQueryRepositoryAdapter<
      UserDto,
      UserWithRelativeInfo | null
    >,
    private readonly usersRepository: UsersRepositoryAdapter<
      UserDto,
      UserWithRelativeInfo | null
    >,
    private readonly hashingService: HashingService,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: RegisterUserCommand) {
    try {
      const { email, password } = command;

      let user = await this.usersQueryRepository.findByEmail(email);

      if (user?.registrationConfirmation?.isConfirmed) {
        throw new ConflictException('Email address is already registered');
      }

      const hashedPassword = await this.hashingService.hash(password);

      user = await this.usersRepository.create({
        email,
        password: hashedPassword,
      });

      const confirmationCode = user?.registrationConfirmation?.code;

      await this.emailService.sendRegistrationConfirmation(
        email,
        <string>confirmationCode,
      );

      return user;
    } catch (error) {
      console.log(error);

      if (error instanceof ConflictException) {
        throw new ConflictException('Email address is already registered');
      }

      throw new ServiceUnavailableException('Could not create a user');
    }
  }
}
