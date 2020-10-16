import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
// import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3500);

  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true, // 👈
    whitelist: true,
  }));
  // app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
      .setTitle('Backend Course API')
      .setDescription('Backend Course API')
      .setVersion('0.0.16')
      .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

}
bootstrap();
