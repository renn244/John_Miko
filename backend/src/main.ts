import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AllExceptionFilter } from './AllExceptionFilter';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './CustomValidationPipe';
import { getAllowedFrontendOrigins } from './config/origins';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());

  const allowedFrontendOrigins = getAllowedFrontendOrigins();

  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
    origin: allowedFrontendOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
