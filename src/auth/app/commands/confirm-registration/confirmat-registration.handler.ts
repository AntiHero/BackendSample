import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { QueryRepository } from 'src/auth/infastructure/repositories/query-repository';
import { InvalidCodeException } from 'src/@shared/exceptions/invalid-code.exception';
import { ConfirmRegistrationCommand } from './confirm-registration.command';
import { Repository } from 'src/auth/infastructure/repositories/repository';
import { USERS_QUERY_REPOSITORY_TOKEN } from 'src/@shared/constants';
import { UserWithRelativeInfo } from 'src/@shared/@types';
import { UserDto } from 'src/auth/app/dtos/user.dto';

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationHandler implements ICommandHandler {
  public constructor(
    @Inject(USERS_QUERY_REPOSITORY_TOKEN)
    private readonly usersQueryRepository: QueryRepository<
      UserDto,
      UserWithRelativeInfo | null
    >,
    private readonly usersRepository: Repository<
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
