import { Injectable } from '@nestjs/common';
import {DataSource, Repository} from "typeorm";
import {GameResult} from "../../models/db-models/GameResult";

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
}
