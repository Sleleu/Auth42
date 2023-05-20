import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({	origin: "http://localhost:3000",
  					methods: 'GET, POST, PUT, PATCH, DELETE',
  					allowedHeaders: "Content-Type, Accept, Authorization",
					credentials: true})
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // protect against data not set in the DTO
  app.use(cookieParser());
  await app.listen(5000);
}

bootstrap();
