import { NestFactory } from '@nestjs/core';
import { AllExceptionFilter } from './AllExceptionFilter';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './CustomValidationPipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter())
  
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
