import {GameResult} from "../db-models/GameResult";
import {ApiProperty} from "@nestjs/swagger";

export class GameResultDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    player1: number;

    @ApiProperty()
    player1mmr: number;

    @ApiProperty()
    player2: number;

    @ApiProperty()
    player2mmr: number;

    @ApiProperty()
    result: string;

    static ofGameResult(gameResult: GameResult) {
        const gameResultDTO = new GameResultDTO();
        gameResultDTO.id = gameResult.id
        gameResultDTO.player1 = gameResult.player1
        gameResultDTO.player2 = gameResult.player2
        gameResultDTO.player1mmr = gameResult.player1mmr
        gameResultDTO.player2mmr = gameResult.player2mmr
        gameResultDTO.result = gameResult.result
        return gameResultDTO;
    }
}