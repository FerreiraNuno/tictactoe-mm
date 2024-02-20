import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { UserController } from "../../UserController";
import { AuthService } from "./auth.service";

function test() {
  console.log("I WAS HERE")
  return 'hard!to-guess_secret'
}

@Module({  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: test(),
          secretOrPrivateKey: test()
        }
      }
    })],
  providers: [AuthService,],
  controllers: [UserController],
  exports: [AuthService],
})
export class AuthModule {}
