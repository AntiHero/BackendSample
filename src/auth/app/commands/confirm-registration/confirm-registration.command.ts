import { IsNotEmpty, IsString, validateSync } from 'class-validator';

export class ConfirmRegistrationCommand {
  @IsString()
  @IsNotEmpty()
  public readonly code: string;

  public constructor(code: string) {
    this.code = code;

    const errors = validateSync(this);
    console.log(errors);

    if (errors.length > 0) {
      throw new Error('Wrong command data');
    }
  }
}
