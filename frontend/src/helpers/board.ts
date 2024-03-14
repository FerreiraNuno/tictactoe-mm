import { ref } from "vue"

export const board = ref([
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
])
const currentPlayer = ref<'X' | 'O'>('X')

export function makeMove (row: number, col: number): void {
  if (board.value[row][col] !== '') {
    return
  }

  board.value[row][col] = currentPlayer.value

  currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
}