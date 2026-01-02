import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Serve uploaded files so they are accessible at /uploads/... (e.g., images)
  app.useStaticAssets(join(process.cwd(), 'uploads'));
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
