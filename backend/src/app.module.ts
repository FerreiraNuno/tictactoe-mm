import {Module} from "@nestjs/common";
import {UserController} from "./controller/UserController";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./models/db-models/User";
import {EncryptService} from "./services/encrypt/encrypt.service";
import {ConfigModule} from "@nestjs/config";
import {UserService} from "./services/user/user.service";
import {AuthService} from "./services/auth/auth.service";
import {AuthModule} from "./services/auth/auth.module";

@Module({
    providers: [
        EncryptService,
        UserService,
        AuthService,
    ],
    imports: [
        AuthModule,
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
    controllers: [UserController]
})
export class AppModule {
}
