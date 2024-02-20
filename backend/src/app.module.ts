import { Module } from "@nestjs/common";
import { UserController } from "./UserController";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./models/db-models/User";
import { EncryptService } from "./services/encrypt/encrypt.service";
import { AuthService } from "./services/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./services/auth/auth.module";
import { UserService } from "./services/user/user.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "./db.sqlite",
      entities: [User],
      synchronize: true
    }),
    ConfigModule.forRoot({
      envFilePath: ".env"
    }),
  ],
  controllers: [UserController],
  providers: [
    EncryptService,
    AuthService,
    JwtService,
    AuthModule,
    UserService
  ]
})
export class AppModule {
}
