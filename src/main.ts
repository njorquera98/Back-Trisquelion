import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: ['http://localhost:4200', 'https://atencion.trisquelion.cl', 'https://check.trisquelion.cl'], // URL del frontend Angular
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type, Authorization',
  };

  app.enableCors(corsOptions); // Habilitar CORS con las opciones

  // Usar express para servir archivos estáticos
  app.use('/assets', express.static(join(__dirname, '..', 'assets')));

  await app.listen(3000); // Puerto del backend
}
bootstrap();

