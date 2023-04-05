import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { UserWithRelativeInfo } from 'src/@shared/@types';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/auth/app/dtos/user.dto';
import { Repository } from 'src/@shared/repository';

@Injectable()
export class UsersRepository extends Repository<
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
}
