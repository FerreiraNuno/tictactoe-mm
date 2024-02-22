import {Injectable, UnauthorizedException} from '@nestjs/common';
import {Game} from "../../models/Game";
import {User} from "../../models/db-models/User";
import {UserService} from "../user/user.service"
import {parse} from "cookie";
import {AuthService} from "../auth/auth.service";
import {WSConnection} from "../../models/WSConnection";

@Injectable()
export class GameService {

    constructor(
        private games: Game[],
        private inSearchQueue: User[],
        private wsConnections: Set<WSConnection>,
        private userService: UserService,
        private authService: AuthService
    ) {
    }

    // async searchForGame(userId: string) {
    //     const user = await this.userService.getUser(Number(userId));
    //     this.checkForPartner(user)
    // }
    //
    //     private checkForPartner(user: User) {
    //
    //     }
    async getUserId(client: any): Promise<number> {
        const cookies = client.handshake.headers.cookie;
        if (!cookies) {
            throw new UnauthorizedException("no user cookie found")
        }
        const parsedCookies = parse(cookies || '');
        if (!parsedCookies) {
            throw new UnauthorizedException("no user cookie found")
        }
        const userToken = parsedCookies['ttt-userid'];
        if (!userToken) {
            throw new UnauthorizedException("no user cookie found")
        }
        const userId = await this.authService.getUserId(userToken);
        if (!userToken) {
            throw new UnauthorizedException("no user found")
        }
        return userId
    }

    addNewConnection(user: User, client: any, args: any[]) {
        const newWsConnection:WSConnection = new WSConnection(
            user,
            client,
            args
        )
        this.wsConnections.add(newWsConnection)
    }

    removeConnection(client: any) {
        this.wsConnections.
        this.wsConnections.delete()
    }
}
