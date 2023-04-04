import { NestFactory } from '@nestjs/core';

import { setupSwagger } from './config/swagger.config';
import { AppModule } from './app.module';
import { setupPipes } from './config/pipes.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setupSwagger(app);

  setupPipes(app);

  await app.listen(3000);
}
bootstrap();
