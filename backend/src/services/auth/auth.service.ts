import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService
    ) {
    }

    async signIn(id: number, username: string) {
        return await this.jwtService.signAsync({username:username, sub: id})
    }
}
