import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Trim } from 'src/@shared/decorators/trim.decorator';

export class RegistrationDto {
  @IsEmail()
  email = '';

  @MinLength(6)
  @MaxLength(20)
  @Trim()
  password = '';
}
