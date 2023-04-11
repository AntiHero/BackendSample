import { NestFactory } from '@nestjs/core';

import { setupSwagger } from './config/swagger.config';
import { setupCookies } from './config/cookies.config';
import { setupPipes } from './config/pipes.config';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setupSwagger(app);

  setupPipes(app);
  setupCookies(app);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
