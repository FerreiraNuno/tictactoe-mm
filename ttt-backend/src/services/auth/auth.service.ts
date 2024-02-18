import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {
  }

  public async signIn(userId: number, username: string): Promise<string>{
    return await this.jwtService.signAsync({sub: userId, username: username});
  }

}
