import { Injectable } from '@nestjs/common';
import {UserService} from "../user/user.service";
import {GameService} from "../game/game.service";
import {GameResultService} from "../game-result/game-result.service";
import {CreateUserDTO} from "../../models/DTO/CreateUserDTO";
import {GameResult} from "../../models/db-models/GameResult";
import {EndResult} from "../../models/db-models/EndResult";

@Injectable()
export class SeederService {
    constructor(
        private userService: UserService,
        private gameService: GameService,
        private gameResultService: GameResultService
    ) {}


    async seedDemoUsers() {
        if ((await this.userService.getAllUsers()).length != 0) {
            console.log("Demo data already loaded. Skipping")
            return
        }
        const adminUser = new CreateUserDTO();
        adminUser.username = 'admin'
        adminUser.password = 'admin'
        await this.userService.register(adminUser)

        const otherUser = new CreateUserDTO();
        otherUser.username = 'max'
        otherUser.password = 'musterman'
        await this.userService.register(otherUser)

        const gameResult = new GameResult();
        gameResult.player1 = 1
        gameResult.player2 = 2
        gameResult.result = EndResult.PLAYER_1.toString()
        gameResult.player1mmr = this.userService.calculateNewEloRating(1000, 1000, 1)
        gameResult.player2mmr = this.userService.calculateNewEloRating(1000, 1000, 0)
        await this.userService.updateUserRating(1, gameResult.player1mmr)
        await this.userService.updateUserRating(2, gameResult.player2mmr)
        await this.gameResultService.addResult(gameResult)

        const gameResult2 = new GameResult();
        gameResult2.player1 = 1
        gameResult2.player2 = 2
        gameResult2.result = EndResult.PLAYER_2.toString()
        gameResult2.player1mmr = this.userService.calculateNewEloRating(gameResult.player1mmr, gameResult.player2mmr, 1)
        gameResult2.player2mmr = this.userService.calculateNewEloRating(gameResult.player1mmr, gameResult.player2mmr, 0)
        await this.userService.updateUserRating(1, gameResult2.player1mmr)
        await this.userService.updateUserRating(2, gameResult2.player2mmr)
        await this.gameResultService.addResult(gameResult2)

        const gameResult3 = new GameResult();
        gameResult3.player1 = 1
        gameResult3.player2 = 2
        gameResult3.result = EndResult.PLAYER_2.toString()
        gameResult3.player1mmr = this.userService.calculateNewEloRating(gameResult2.player1mmr, gameResult2.player2mmr, 1)
        gameResult3.player2mmr = this.userService.calculateNewEloRating(gameResult2.player1mmr, gameResult2.player2mmr, 0)
        await this.userService.updateUserRating(1, gameResult3.player1mmr)
        await this.userService.updateUserRating(2, gameResult3.player2mmr)
        await this.gameResultService.addResult(gameResult3)

        console.log("Demo data finished loading")
    }
}
