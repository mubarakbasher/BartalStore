import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  app.use(helmet({ contentSecurityPolicy: false }));

  app.enableCors({
    origin: config.get<string[]>('corsOrigins') ?? true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));

  const swagger = new DocumentBuilder()
    .setTitle('Bartal API')
    .setDescription(
      'Bilingual (AR/EN) e-commerce backend for Sudan — see the PRD for the full spec.',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = config.get<number>('port') ?? 3001;
  const host = config.get<string>('host') ?? '0.0.0.0';
  await app.listen(port, host);
  logger.log(`Bartal API listening on http://${host}:${port}`);
  logger.log(`Swagger UI:        http://${host}:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap Bartal API:', err);
  process.exit(1);
});
