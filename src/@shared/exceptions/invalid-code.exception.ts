import { BadRequestException } from '@nestjs/common';

export class InvalidCodeException extends BadRequestException {
  constructor() {
    super('Invalid or expired registration code');
  }
}
