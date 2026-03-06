import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomValidationPipe } from './CustomValidationPipe';
import { AllExceptionFilter } from './AllExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter())
  
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
