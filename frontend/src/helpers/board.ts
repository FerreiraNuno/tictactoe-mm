import { ref } from "vue"

export interface Game {
  gameId: number
  player1Username: string
  player2Username: string
  player1mmr: number
  player2mmr: number
  field: FieldStatus[][]
  currentUsername: string
}

export enum FieldStatus {
  Empty = 0,
  P1 = 1,
  P2 = 2,
}

export function makeMoveOnBoard (row: number, col: number, move: FieldStatus, board: FieldStatus[][]): FieldStatus[][] {
  if (board[row][col] !== 0) {
    return board
  }

  board[row][col] = move
  return board
}