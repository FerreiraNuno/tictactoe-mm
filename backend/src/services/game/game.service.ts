import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {Game} from "../../models/Game";
import {User} from "../../models/db-models/User";
import {parse} from "cookie";
import {AuthService} from "../auth/auth.service";
import {WSConnection} from "../../models/WSConnection";
import {MakeMoveDTO} from "../../models/DTO/MakeMoveDTO";
import {Socket} from "socket.io";
import {GameEndDTO} from "../../models/DTO/GameEndDTO";
import {GameStatusDTO} from "../../models/DTO/GameStatusDTO";

@Injectable()
export class GameService {

    constructor(
        private games: Map<number, Game>,
        private inSearchQueue: Set<WSConnection>,
        private wsConnections: Map<string, WSConnection>,
        private authService: AuthService
    ) {
    }

    async getUserId(client: Socket): Promise<number> {
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

    private getClientId(client: Socket): string {
        return client.id;
    }

    getConnectionByClient(client: Socket) {
        const clientId = this.getClientId(client);
        return this.wsConnections.get(clientId)
    }

    //TODO: Change search to cronjob (maybe buckets?)
    addToSearch(client: Socket) {
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

        const game = new Game(connection, opponentPlayer);
        let gameId: number
        do {
            gameId = Math.floor(Math.random() * 10000) + 1;
        } while (this.games.has(gameId))

        this.games.set(gameId, game)


        //TODO send all info about user
        const gameDTO = new GameStatusDTO();
        gameDTO.gameId = gameId
        gameDTO.player1Username = connection.user.username
        gameDTO.player2Username = opponentPlayer.user.username
        gameDTO.currentUsername = game.getActivePlayerName()
        gameDTO.field = game.getField()
        connection.client.emit("game.new", gameDTO)
        opponentPlayer.client.emit("game.new", gameDTO)
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

    makeMove(client: Socket, payload: MakeMoveDTO) {
        const game = this.games.get(payload.gameId);
        const wsConnection = this.wsConnections.get(client.id);
        if (!game.isUserInGame(wsConnection)) {
            throw new UnauthorizedException("you are not allowed to make a move in this game")
        }
        game.makeMove(payload.xPos, payload.yPos, wsConnection);

        const gameUpdateDTO = new GameStatusDTO();
        gameUpdateDTO.gameId = payload.gameId
        gameUpdateDTO.currentUsername = game.getActivePlayerName()
        gameUpdateDTO.player1Username = game.player1.user.username
        gameUpdateDTO.player2Username = game.player2.user.username
        gameUpdateDTO.field = game.getField()
        game.player1.client.emit("game.update", gameUpdateDTO)
        game.player2.client.emit("game.update", gameUpdateDTO)

        const winner = game.checkForWin();
        if (winner) {
            const winMessageDTO: GameEndDTO = new GameEndDTO()
            winMessageDTO.gameId = payload.gameId
            winMessageDTO.winner = winner.user.username
            game.player1.client.emit("game.end", winMessageDTO)
            game.player2.client.emit("game.end", winMessageDTO)
            //TODO Save GameResult and calculate new elo for both players
            this.games.delete(payload.gameId)
        }
    }
}
