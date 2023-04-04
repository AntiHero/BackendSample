import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';

import { PrismaService } from 'src/prisma/prisma.service';
import { Repository } from 'src/@shared/repository';
import { UserDto } from 'src/auth/app/dtos/user.dto';

@Injectable()
export class UsersRepository extends Repository<UserDto, User | null> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(userDto: UserDto): Promise<User | null> {
    const { email, password } = userDto;
    try {
      return this.prismaService.user.create({
        data: {
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
      });
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
