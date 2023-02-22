import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// Main module
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  });
  await app.listen(3000);
}
bootstrap();
