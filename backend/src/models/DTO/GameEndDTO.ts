import {ApiProperty} from "@nestjs/swagger";

export class GameEndDTO {
    @ApiProperty()
    gameId: number

    @ApiProperty()
    winner: string
}