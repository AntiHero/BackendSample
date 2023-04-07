import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UseresQueryRepositoryAdapter } from 'src/@shared/adapters/users.query-repository-adapter';
import { UsersRepositoryAdapter } from 'src/@shared/adapters/users.repository-adapter';
import { InvalidCodeException } from 'src/@shared/exceptions/invalid-code.exception';
import { ConfirmRegistrationCommand } from './confirm-registration.command';
import { UserWithRelativeInfo } from 'src/@shared/types';
import { UserDto } from 'src/auth/app/dtos/user.dto';

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationHandler implements ICommandHandler {
  public constructor(
    private readonly usersQueryRepository: UseresQueryRepositoryAdapter<
      UserDto,
      UserWithRelativeInfo | null
    >,
    private readonly usersRepository: UsersRepositoryAdapter<
      UserDto,
      UserWithRelativeInfo | null
    >,
  ) {}

  public async execute(command: ConfirmRegistrationCommand): Promise<void> {
    try {
      const { code } = command;

      const user =
        await this.usersQueryRepository.findByRecoveryOrConfirmationCode(code);

      if (!user) throw new InvalidCodeException();

      const exp = user?.registrationConfirmation?.exp ?? new Date();

      if (exp > new Date()) throw new InvalidCodeException();

      await this.usersRepository.register(user.id);
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
