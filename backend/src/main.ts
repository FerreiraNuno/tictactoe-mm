import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as cookieParser from 'cookie-parser'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle('TicTacToe API')
    .setDescription('The game API description')
    .setVersion('1.0')
    .addTag('game')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.use(cookieParser())

  // Enable CORS for frontend origin
  app.enableCors({
    origin: 'http://localhost:5173', // Specify the frontend origin
    credentials: true, // Allow sending cookies and authorization headers with the request
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed methods
    allowedHeaders: 'Content-Type, Accept', // Specify allowed headers
  })

  await app.listen(3000)
}
bootstrap()
