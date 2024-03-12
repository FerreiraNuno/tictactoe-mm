import {FieldStatus} from "../FieldStatus";
import {Game} from "../Game";
import {ApiProperty} from "@nestjs/swagger";

export class GameUpdateDTO {


    @ApiProperty()
    public field: FieldStatus[][]

    @ApiProperty()
    public activePlayerName: string

    static fromGame(game: Game) {
        const gameUpdateDTO = new GameUpdateDTO(

        );
        gameUpdateDTO.field = game.getField()
        gameUpdateDTO.activePlayerName = game.getActivePlayerName()
        return gameUpdateDTO
    }
}