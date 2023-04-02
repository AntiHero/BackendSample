import { NestFactory } from '@nestjs/core';

import { setupSwagger } from './config/swagger.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
