import { Transform, type TransformFnParams } from 'class-transformer';

export const Trim = () =>
  Transform(({ value }: TransformFnParams) => value?.trim());
