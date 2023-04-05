import { type INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';

export const setupCookies = (app: INestApplication) => {
  app.use(cookieParser());
};
