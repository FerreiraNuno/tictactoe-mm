import {GameResult} from "../db-models/GameResult";

export class GameResultDTO {
    id: number;

    player1: number;

    player1mmr: number;

    player2: number;

    player2mmr: number;

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