<script setup lang="ts">
import { ref } from 'vue';

const board = ref([
    ['X', 'O', ''],
    ['', '', ''],
    ['', '', '']
]);

const currentPlayer = ref<'X' | 'O'>('X');
const winner = ref<string | null>(null);

function makeMove(row: number, col: number): void {
    if (board.value[row][col] !== '' || winner.value !== null) {
        return;
    }

    board.value[row][col] = currentPlayer.value;

    checkWinner();

    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';
}

function checkWinner(): void {
    for (let i = 0; i < 3; i++) {
        if (board.value[i][0] === board.value[i][1] && board.value[i][1] === board.value[i][2] && board.value[i][0] !== '') {
            winner.value = board.value[i][0];
            return;
        }

        if (board.value[0][i] === board.value[1][i] && board.value[1][i] === board.value[2][i] && board.value[0][i] !== '') {
            winner.value = board.value[0][i];
            return;
        }
    }

    if ((board.value[0][0] === board.value[1][1] && board.value[1][1] === board.value[2][2] && board.value[0][0] !== '') ||
        (board.value[0][2] === board.value[1][1] && board.value[1][1] === board.value[2][0] && board.value[0][2] !== '')) {
        winner.value = board.value[1][1];
    }
}
</script>

<template>
    <div class="container">
        <div class="left">
            <div id="tic-tac-toe">
                <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
                    <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="cell"
                        @click="makeMove(rowIndex, cellIndex)">
                        {{ cell }}
                    </div>
                </div>
            </div>
        </div>
        <div class="right"></div>
    </div>
</template>


<style scoped>
.container {
    display: flex;
    flex-direction: row;
    width: 65vw;
    height: 75vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    overflow: hidden;
    background-color: #ffffff;
    /* White background as requested */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.left {
    width: 75vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.right {
    flex-grow: 1;
    background-color: #f0f0f0;
    min-width: 15em;
}

#tic-tac-toe {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 10px;
    background-color: #ffffff;
    border-radius: 12px;
}

.cell {
    width: 100px;
    height: 100px;
    border-radius: 12px;
    margin: 5px;
    background-color: #cceef2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    color: #0097a7;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s;
}

.cell:hover {
    background-color: #b2ebf2;
}

.cell:not(:empty) {
    pointer-events: none;
}
</style>

