import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
// import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true, // 👈
    whitelist: true,
    transform: true
  }));
  // app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
      .setTitle('Nest.js Fundamentals Final Project Docs')
      .setDescription('Nest.js Fundamentals Final Project Docs')
      .setVersion('0.0.17')
      .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3500);
}
bootstrap();
