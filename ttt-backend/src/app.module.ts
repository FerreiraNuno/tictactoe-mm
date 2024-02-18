import { Module } from "@nestjs/common";
import { UserController } from "./UserController";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./models/User";
import { EncryptService } from "./services/encrypt/encrypt.service";
import { AuthService } from "./services/auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db.sqlite',
      entities: [User],
      synchronize: true,
    }),
  ],
  controllers: [UserController],
  providers: [
    AppService,
    EncryptService,
    AuthService,
    JwtService
  ]
})
export class AppModule {
}
