import {GameResult} from "../db-models/GameResult";
import {ApiProperty} from "@nestjs/swagger";
import {UserInfoDTO} from "./UserInfoDTO";

export class GameResultDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    player1: number;

    @ApiProperty()
    player1Name: string;

    @ApiProperty()
    player1mmr: number;

    @ApiProperty()
    player2: number;

    @ApiProperty()
    player2Name: string;

    @ApiProperty()
    player2mmr: number;

    @ApiProperty()
    result: string;

    static ofGameResult(gameResult: GameResult, allUsers: UserInfoDTO[]) {
        const gameResultDTO = new GameResultDTO();

        function getUserNameByUserId(allUsers: UserInfoDTO[], player1: number) {
            return allUsers.find(value => value.id === player1).username;
        }

        gameResultDTO.player1Name = getUserNameByUserId(allUsers, gameResult.player1)
        gameResultDTO.player2Name = getUserNameByUserId(allUsers, gameResult.player2)
        gameResultDTO.id = gameResult.id
        gameResultDTO.player1 = gameResult.player1
        gameResultDTO.player2 = gameResult.player2
        gameResultDTO.player1mmr = gameResult.player1mmr
        gameResultDTO.player2mmr = gameResult.player2mmr
        gameResultDTO.result = gameResult.result
        return gameResultDTO;
    }
}