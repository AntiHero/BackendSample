import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/auth/app/dtos/user.dto';
import { QueryRepository } from './query-repository';

@Injectable()
export class UsersQueryRepository extends QueryRepository<
  UserDto,
  User | null
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }
  public async findByEmail(email: string) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          email,
          registrationConfirmation: {
            isConfirmed: false,
          },
        },
      });

      return user;
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
