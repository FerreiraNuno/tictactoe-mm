import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {Game} from "../../models/Game";
import {User} from "../../models/db-models/User";
import {parse} from "cookie";
import {AuthService} from "../auth/auth.service";
import {WSConnection} from "../../models/WSConnection";
import {MakeMoveDTO} from "../../models/DTO/MakeMoveDTO";
import {Server, Socket} from "socket.io";
import {GameEndDTO} from "../../models/DTO/GameEndDTO";
import {GameStatusDTO} from "../../models/DTO/GameStatusDTO";
import {UserService} from "../user/user.service";
import {GameEndStatusDTO} from "../../models/DTO/GameEndStatusDTO";
import {UserInfoDTO} from "../../models/DTO/UserInfoDTO";
import {GameResultService} from "../game-result/game-result.service";
import {GameResult} from "../../models/db-models/GameResult";
import {EndResult} from "../../models/db-models/EndResult";

@Injectable()
export class GameService {
    private server: Server;

    constructor(
        private games: Map<number, Game>,
        private inSearchQueue: Set<WSConnection>,
        private wsConnections: Map<string, WSConnection>,
        private authService: AuthService,
        private userService: UserService,
        private gameResultService: GameResultService
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
            this.server.emit("search.count", {'count': this.inSearchQueue.size})
            return
        }

        this.inSearchQueue.delete(opponentPlayer)
        //just in case the user was already in the search queue
        this.inSearchQueue.delete(connection)

        this.server.emit("search.count", {'count': this.inSearchQueue.size})

        const game = new Game(connection, opponentPlayer);
        let gameId: number
        do {
            gameId = Math.floor(Math.random() * 10000) + 1;
        } while (this.games.has(gameId))

        this.games.set(gameId, game)


        //TODO send all info about user <- Only MMR is needed to be displayed. Is added
        const gameDTO = new GameStatusDTO();
        gameDTO.gameId = gameId
        gameDTO.player1Username = connection.user.username
        gameDTO.player2Username = opponentPlayer.user.username
        gameDTO.player1mmr = connection.user.mmr;
        gameDTO.player2mmr = opponentPlayer.user.mmr;
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

    async makeMove(client: Socket, payload: MakeMoveDTO) {
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

            const playerLost = game.player1.user.id === winner.user.id ? game.player1 : game.player2

            //TODO Save GameResult and calculate new elo for both players <- Check if works!
            await this.endMatchPlayerWon(winner, playerLost)

            const endResult = game.player1.user.id === winner.user.id ? EndResult.PLAYER_1 : EndResult.PLAYER_2
            await this.saveGameRating(winner, playerLost, endResult)

            this.games.delete(payload.gameId)
            return;
        }
        if (game.isFieldFull()) {
            //TODO Add how to handle when Field is full but no one won
            await this.endMatchDraw(game.player1, game.player2)
            await this.saveGameRating(game.player1, game.player2, EndResult.DRAW)
        }
    }

    async endMatchPlayerWon(winner: WSConnection, looser: WSConnection) {
        winner.user.mmr = this.userService.calculateNewEloRating(winner.user.mmr, looser.user.mmr, 1)
        //Update User Rating of winner

        looser.user.mmr = this.userService.calculateNewEloRating(looser.user.mmr, winner.user.mmr, 0)
        // Update loosing Players Rating

        await this.userService.updateUserRating(winner.user.id, winner.user.mmr)
        //Update the Value in Database for winner of the match

        await this.userService.updateUserRating(looser.user.id, looser.user.mmr)
        //Update the Value in Database for Looser of the match

        await this.userService.updateWinLostCount(winner.user.id, GameEndStatusDTO.WIN)
        await this.userService.updateWinLostCount(looser.user.id, GameEndStatusDTO.LOOSE)
        //increment win and loose counter for both players
    }

    async saveGameRating(player1: WSConnection, player2: WSConnection, gameResultState: EndResult) {
        const gameResult = new GameResult();
        gameResult.player1 = player1.user.id
        gameResult.player2 = player2.user.id

        //Execute after new Elo has been set
        gameResult.player1mmr = player1.user.mmr
        gameResult.player2mmr = player2.user.mmr

        gameResult.result = gameResultState.toString()

        await this.gameResultService.addResult(gameResult)
    }


    async endMatchDraw(player1: WSConnection, player2: WSConnection) {
        //TODO Check if Draw Function works properly
        player1.user.mmr = this.userService.calculateNewEloRating(player1.user.mmr, player2.user.mmr, 0.5)
        //Update User Rating of winner

        player2.user.mmr = this.userService.calculateNewEloRating(player2.user.mmr, player1.user.mmr, 0.5)
        // Update loosing Players Rating


        //TODO Check for Async/Await call. Might Update User Rating too soon.
        await this.userService.updateUserRating(player1.user.id, player1.user.mmr)
        //Update the Value in Database for winner of the match

        await this.userService.updateUserRating(player2.user.id, player2.user.mmr)
        //Update the Value in Database for Looser of the match

        await this.userService.updateWinLostCount(player1.user.id, GameEndStatusDTO.TIE)
        await this.userService.updateWinLostCount(player2.user.id, GameEndStatusDTO.TIE)
        //increment win and loose counter for both players
    }


    getUserInQueue() {
        const userList: UserInfoDTO[] = []
        for (const ws of this.inSearchQueue) {
            userList.push(UserInfoDTO.fromUser(ws.user))
        }

        return userList
    }

    getUserInQueueCount() {
        return this.inSearchQueue.size
    }

    setServer(server: Server) {
        this.server = server
    }
}