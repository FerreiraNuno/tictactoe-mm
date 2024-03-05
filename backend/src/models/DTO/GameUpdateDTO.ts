import {FieldStatus} from "../FieldStatus";
import {Game} from "../Game";

export class GameUpdateDTO {

    constructor(
        private field: FieldStatus[][],
        private activePlayerName: string
    ) {
    }
    static fromGame(game: Game) {
        return new GameUpdateDTO(
            game.getField(),
            game.getActivePlayerName()
        )
    }
}