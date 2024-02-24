import {FieldStatus} from "../FieldStatus";

export class GameStatusDTO {
    gameId: number
    player1Username: string
    player2Username: string
    field: FieldStatus[][]
    currentUsername: string
}