import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuracion Swagger
  const config = new DocumentBuilder()
    .setTitle('API del E-Commerce')
    .setDescription('Documentación de la API del E-Commerce')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Endpoint de Swagger: /api

  // Validacion de datos de definidos con los decoradores en los DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Asegura que se haga la transformación con class-transformer
    }),
  );

  app.enableCors({
    origin: '*', // Solo para desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
