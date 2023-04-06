import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { UsersRepositoryAdapter } from 'src/@shared/adapters/users.repository-adapter';
import { UserWithRelativeInfo } from 'src/@shared/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/auth/app/dtos/user.dto';

@Injectable()
export class UsersRepository extends UsersRepositoryAdapter<
  UserDto,
  UserWithRelativeInfo | null
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(userDto: UserDto): Promise<UserWithRelativeInfo | null> {
    const { email, password } = userDto;
    try {
      return this.prismaService.user.upsert({
        where: { email },
        update: {
          password,
          registrationConfirmation: {
            update: {
              code: randomUUID(),
              exp: new Date(Date.now() + 600_000),
            },
          },
        },
        create: {
          email,
          password,
          registrationConfirmation: {
            create: {
              code: randomUUID(),
              exp: new Date(Date.now() + 600_000),
            },
          },
          passwordRecovery: {
            create: {},
          },
        },
        include: {
          registrationConfirmation: { select: { isConfirmed: true } },
        },
      });
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async register(id: string): Promise<void | null> {
    try {
      await this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          registrationConfirmation: {
            update: {
              isConfirmed: true,
              code: null,
              exp: null,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
