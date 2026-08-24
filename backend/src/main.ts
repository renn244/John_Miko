import { NestFactory } from '@nestjs/core';
import { AllExceptionFilter } from './AllExceptionFilter';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './CustomValidationPipe';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());

  const allowedFrontendOrigins = (
    process.env.FRONTEND_URLS ??
    process.env.FRONTEND_URL ??
    'http://localhost:5173'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    allowedHeaders: '*',
    origin: allowedFrontendOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
