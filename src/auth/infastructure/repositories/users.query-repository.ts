import { Injectable } from '@nestjs/common';

import { UseresQueryRepositoryAdapter } from 'src/@shared/adapters/users.query-repository-adapter';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserWithRelativeInfo } from 'src/@shared/types';
import { UserDto } from 'src/auth/app/dtos/user.dto';

@Injectable()
export class UsersQueryRepository extends UseresQueryRepositoryAdapter<
  UserDto,
  UserWithRelativeInfo | null
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async findByEmail(email: string) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          email,
        },
        include: {
          registrationConfirmation: { select: { isConfirmed: true } },
        },
      });

      return user;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async findByRecoveryOrConfirmationCode(
    code: string,
  ): Promise<UserWithRelativeInfo | null> {
    try {
      return this.prismaService.user.findFirst({
        where: {
          OR: [
            {
              registrationConfirmation: {
                code,
              },
            },
            {
              passwordRecovery: {
                code,
              },
            },
          ],
        },
      });
    } catch (error) {
      console.log(error);

      // TODO: throw DB error
      throw error;
    }
  }

  public async findById(id: string): Promise<UserWithRelativeInfo | null> {
    try {
      return this.prismaService.user.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log(error);

      // throw DB error
      throw error;
    }
  }
}
