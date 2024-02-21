import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from 'express';
import { join } from "path";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('TicTacToe API')
    .setDescription('The ttt API description')
    .setVersion('1.0')
    .addServer("/api/v1/")
    .addTag('ttt')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
