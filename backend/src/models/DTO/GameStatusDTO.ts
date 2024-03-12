import {FieldStatus} from "../FieldStatus";
import {ApiProperty} from "@nestjs/swagger";

export class GameStatusDTO {

    @ApiProperty()
    gameId: number

    @ApiProperty()
    player1Username: string

    @ApiProperty()
    player2Username: string

    @ApiProperty()
    player1mmr: number

    @ApiProperty()
    player2mmr: number

    @ApiProperty()
    field: FieldStatus[][]

    @ApiProperty()
    currentUsername: string
}