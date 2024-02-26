import {FieldStatus} from "../FieldStatus";

export class GameStatusDTO {
    gameId: number
    player1Username: string
    player2Username: string
    player1mmr: number
    player2mmr: number
    field: FieldStatus[][]
    currentUsername: string
}