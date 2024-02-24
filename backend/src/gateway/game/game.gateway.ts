import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {UserService} from 'src/services/user/user.service';
import {AuthService} from "../../services/auth/auth.service";
import {UnauthorizedException} from "@nestjs/common";
import {GameService} from "../../services/game/game.service";
import {MakeMoveDTO} from "../../models/DTO/MakeMoveDTO";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private gameService: GameService
    ) {
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.gameService.getUserId(client).then(async userId => {
            const user = await this.userService.getUser(userId);
            if (!user) {
                throw new UnauthorizedException("could not find user")
            }
            this.gameService.addNewConnection(user, client, args)
            console.log(`Client connected: ${client.id} + ${args} User: ${user.username}`);
        })
    }

    handleDisconnect(client: Socket) {
        const connection = this.gameService.getConnectionByClient(client);
        this.gameService.removeConnection(client)
        console.log(`Client disconnected: ${client.id} - User ${connection.user.username}`);

    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: string): void {
        console.log(payload)
        this.server.emit('message', payload);
    }

    @SubscribeMessage('search')
    handleSearch(client: Socket): void {
        this.gameService.addToSearch(client)
    }

    @SubscribeMessage('game.move')
    handleMakeMove(client: Socket, payload: MakeMoveDTO): void {
        this.gameService.makeMove(client, payload);
    }
}
