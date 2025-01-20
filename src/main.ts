import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: ['http://localhost:4200', 'https://atencion.trisquelion.cl'], // URL del frontend Angular
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type, Authorization',
  };

  app.enableCors(corsOptions); // Habilitar CORS con las opciones

  await app.listen(3000); // Puerto del backend
}
bootstrap();

