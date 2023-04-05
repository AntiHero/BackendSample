import { IsUUID, validateSync } from 'class-validator';

export class ConfirmRegistrationCommand {
  @IsUUID()
  public readonly code: string;

  public constructor(code: string) {
    this.code = code;

    const errors = validateSync(this);

    if (errors.length > 0) {
      throw new Error('Wrong command data');
    }
  }
}
