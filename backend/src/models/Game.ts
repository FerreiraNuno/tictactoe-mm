import {WSConnection} from "./WSConnection";

enum FieldStatus {
    Empty = 0,
    P1 = 1,
    P2 = 2,
}

export class Game {

    private field: FieldStatus[][] = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]

    constructor(
        private player1: WSConnection,
        private player2: WSConnection,
        private isPlayer1Turn: boolean,
        private server: WebSocket
    ) {
        this.isPlayer1Turn = Math.random() % 1 == 0
    }

    makeMove(x: number, y: number, userId: number) {
        this.field[x][y] = userId === this.player1.user.id ? FieldStatus.P1 : FieldStatus.P2
    }

    checkForWin(): WSConnection | null {
        // Check rows
        for (let row = 0; row < 3; row++) {
            if (this.field[row][0] !== FieldStatus.Empty && this.field[row][0] === this.field[row][1] && this.field[row][1] === this.field[row][2]) {
                return this.field[row][0] === FieldStatus.P1 ? this.player1 : this.player2;
            }
        }

        // Check columns
        for (let col = 0; col < 3; col++) {
            if (this.field[0][col] !== FieldStatus.Empty && this.field[0][col] === this.field[1][col] && this.field[1][col] === this.field[2][col]) {
                return this.field[0][col] === FieldStatus.P1 ? this.player1 : this.player2;
            }
        }

        // Check diagonals
        if (this.field[0][0] !== FieldStatus.Empty && this.field[0][0] === this.field[1][1] && this.field[1][1] === this.field[2][2]) {
            return this.field[0][0] === FieldStatus.P1 ? this.player1 : this.player2;
        }
        if (this.field[0][2] !== FieldStatus.Empty && this.field[0][2] === this.field[1][1] && this.field[1][1] === this.field[2][0]) {
            return this.field[0][2] === FieldStatus.P1 ? this.player1 : this.player2;
        }

        // No win found
        return null;
    }
}