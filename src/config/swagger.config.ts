import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import loader from 'speccy/lib/loader';

export const setupSwagger = async (app: INestApplication): Promise<void> => {
  const options = {
    resolve: true,
    jsonSchema: true,
  };

  const document: OpenAPIObject = await loader.loadSpec(
    './docs/swagger.yaml',
    options,
  );

  SwaggerModule.setup('api', app, document);
};
