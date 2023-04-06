import { IsEmail, IsNotEmpty, IsString, validateSync } from 'class-validator';

export class RefreshTokenCommand {
  @IsString()
  @IsNotEmpty()
  // TODO: Check user existance
  public userId: string;

  @IsEmail()
  public email: string;

  public constructor(userId: string, email: string) {
    this.userId = userId;
    this.email = email;

    const errors = validateSync(this);

    if (errors.length > 0) {
      throw new Error('Wrong command data');
    }
  }
}
