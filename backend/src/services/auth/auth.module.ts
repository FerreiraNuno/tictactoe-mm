import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
//import { jwtConstants } from "./constant";
import { UserController } from "../../UserController";
import { AuthService } from "./auth.service";

function test() {
  console.log("I WAS HERE")
  return 'hard!to-guess_secret'
}

@Module({  imports: [
    JwtModule.register({
      secret: test(), //jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    })],
  providers: [AuthService,],
  controllers: [UserController],
  exports: [AuthService],
})
export class AuthModule {}
