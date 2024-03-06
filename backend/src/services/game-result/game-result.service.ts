import { Injectable } from '@nestjs/common';
import {DataSource, Repository} from "typeorm";
import {GameResult} from "../../models/db-models/GameResult";
import {EndResult} from "../../models/db-models/EndResult";

@Injectable()
export class GameResultService {
    private resultRepository: Repository<GameResult>;

    constructor(
        private dataSource: DataSource
    ) {

        this.resultRepository = dataSource.getRepository(GameResult);
        this.resultRepository.create(new GameResult());
    }

    async addResult(result: GameResult) {
        await this.resultRepository.save(result)
    }

    async getUserMatchesOfUser(userId: number) {
        return await this.resultRepository.findBy({player1: userId} || {player2: userId})
    }

    async getUserMatchesLossesOfUser(userid: number) {
        return await this.resultRepository.createQueryBuilder('gameResult')
            .where('(gameResult.player1 = :userid AND gameResult.result = :lossAsPlayer1) OR (gameResult.player2 = :userid AND gameResult.result = :lossAsPlayer2)', {
                userid,
                lossAsPlayer1: EndResult.PLAYER_2.toString(),
                lossAsPlayer2: EndResult.PLAYER_1.toString(),
            })
            .getMany();
    }

}
