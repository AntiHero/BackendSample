import type {
  User,
  RegistrationConfirmation,
  PasswordRecovery,
} from '@prisma/client';

export type UserWithRelativeInfo = User & {
  registrationConfirmation?: Partial<RegistrationConfirmation> | null;
  passwordRecovery?: Partial<PasswordRecovery> | null;
};
