import { NestFactory } from '@nestjs/core';

import { setupSwagger } from './config/swagger.config';
import { setupCookies } from './config/cookies.config';
import { setupPipes } from './config/pipes.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setupSwagger(app);

  setupPipes(app);
  setupCookies(app);

  await app.listen(3000);
}
bootstrap();
