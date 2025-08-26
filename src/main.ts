import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // CORS
  app.enableCors({
    origin: true, // In production, specify exact origins
    credentials: true,
  });
  
  // Global prefix
  app.setGlobalPrefix('api/v1');
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Digital Library API')
    .setDescription('A comprehensive digital library management system API')
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Books', 'Book management and catalog operations')
    .addTag('User Books', 'User-specific book operations')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .addServer('http://localhost:3000', 'Development server')
    .addServer('https://api.library.com', 'Production server')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Digital Library API Documentation',
  });
  
  const port = configService.get('PORT', 3000);
  
  await app.listen(port);
  
  logger.log(`🚀 Application running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
