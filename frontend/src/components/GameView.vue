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
        <div class="left rounded-xl flex flex-col px-16 py-8">
            <div class="flex justify-end w-full items-end mr-6">
                <div class="ml-1 font-bold">nuno_der</div>
                <div class="ml-1">(1231)</div>
            </div>
            <div id="tic-tac-toe" class="my-4">
                <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
                    <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="cell"
                        @click="makeMove(rowIndex, cellIndex)">
                        {{ cell }}
                    </div>
                </div>
            </div>
            <div class="flex justify-start w-full items-end ml-2">
                <div class="ml-1 font-bold">the_Law</div>
                <div class="ml-1">(1203)</div>
            </div>
        </div>
        <div class="right rounded-xl"></div>
    </div>
</template>


<style scoped>
.container {
    display: flex;
    flex-direction: row;
    width: 80vw;
    height: 75vh;
    overflow: hidden;
}

.left {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e5e5;
    margin-right: 2rem;
    background-color: white;
}

.right {
    flex-grow: 1;
    background-color: rgb(250, 250, 250);
    min-width: 15em;
    border: 1px solid #e5e5e5;
}

#tic-tac-toe {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-radius: 12px;
}

.cell {
    width: 7vw;
    height: 7vw;
    border-radius: 12px;
    margin: 5px;
    background-color: #cceef2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8em;
    font-weight: 600;
    color: #548ada;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s;
}

.cell:hover {
    background-color: #a1e0e9;
}

.cell:not(:empty) {
    pointer-events: none;
}
</style>

