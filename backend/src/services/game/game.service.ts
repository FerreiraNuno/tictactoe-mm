import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
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
        private inSearchQueue: Set<WSConnection>,
        private wsConnections: Map<string, WSConnection>,
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
        const clientId = this.getClientId(client);
        const newWsConnection: WSConnection = new WSConnection(user, client, args);
        this.wsConnections.set(clientId, newWsConnection);
    }

    removeConnection(client: any) {
        const clientId = this.getClientId(client);
        const connection = this.getConnectionByClient(client);
        this.wsConnections.delete(clientId);
        if (this.inSearchQueue.has(connection)) {
            this.inSearchQueue.delete(connection)
        }
    }

    private getClientId(client: any): string {
        return client.id;
    }

    getConnectionByClient(client: any) {
        const clientId = this.getClientId(client);
        return this.wsConnections.get(clientId)
    }

    addToSearch(client: any) {
        const connection: WSConnection = this.getConnectionByClient(client);
        if (this.inSearchQueue.has(connection)) {
            throw new BadRequestException("already in search queue");
        }

        const opponentPlayer = this.searchForPartner(connection)
        if (!opponentPlayer) {
            this.inSearchQueue.add(connection)
            return
        }

        this.inSearchQueue.delete(opponentPlayer)
        //just in case the user was already in the search queue
        this.inSearchQueue.delete(connection)
    }

    private searchForPartner(connection: WSConnection) {
        const mmr = connection.user.mmr;
        for (const playerInQueue of this.inSearchQueue) {
            if (connection.user.id === playerInQueue.user.id) {
                continue
            }
            const oponentMmr = playerInQueue.user.mmr;
            if (Math.abs(oponentMmr - mmr) < 200) {
                return playerInQueue;
            }
        }
        return null;
    }
}
