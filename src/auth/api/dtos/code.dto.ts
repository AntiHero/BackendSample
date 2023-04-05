import { IsNotEmpty, IsString } from 'class-validator';

export class CodeDto {
  @IsString()
  @IsNotEmpty()
  public code = '';
}
