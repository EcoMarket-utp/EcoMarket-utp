import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('EcoMarket API')
    .setDescription('Documentación de la API EcoMarket')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);
  const port = configService.get<number>('PORT', 3002);
  
  await app.listen(port);
  console.log(`🚀 EcoMarket Backend running on port ${port}`);
}
bootstrap();
