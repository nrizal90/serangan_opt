import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan validasi global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Hapus properti yang tidak diizinkan
      forbidNonWhitelisted: true, // Error jika ada properti yang tidak diizinkan
      transform: true, // Transformasi payload ke tipe DTO
    }),
  );

  await app.listen(3000);
}
bootstrap();
