import { Module } from "@nestjs/common";
import { UserController } from "./controller/user/user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./models/db-models/User";
import { EncryptService } from "./services/encrypt/encrypt.service";
import { ConfigModule } from "@nestjs/config";
import { UserService } from "./services/user/user.service";
import { AuthService } from "./services/auth/auth.service";
import { AuthModule } from "./services/auth/auth.module";
import { GameService } from "./services/game/game.service";
import { GameGateway } from "./gateway/game/game.gateway";
import { GameResult } from "./models/db-models/GameResult";
import { GameResultService } from "./services/game-result/game-result.service";

@Module({
  providers: [
    EncryptService,
    UserService,
    AuthService,
    GameService,
    GameGateway,
    GameResultService,
    Map,
    Set,
    Array
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env"
    }),
    AuthModule,
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "./db.sqlite",
      entities: [User, GameResult],
      synchronize: true
    })
  ],
  controllers: [UserController]
})
export class AppModule {
}
