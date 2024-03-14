<script
  setup
  lang="ts"
>
import Chat from './Chat.vue'
import useAuth from '@/helpers/auth'
const router = useRouter()
import { onMounted, ref, watch, watchEffect, type Ref } from 'vue'
import { Socket, io } from "socket.io-client"
import { fetchUser, type User } from '@/helpers/user'
import { useRouter } from 'vue-router'
const { isLoggedIn, checkAuth } = useAuth()
import { board, makeMove } from "@/helpers/board";

import krabs from '@/assets/krabs.png'
import patrick from '@/assets/patrick.png'
import Cookies from 'js-cookie'
import type { DefaultEventsMap } from '@socket.io/component-emitter';

let socket: Socket<DefaultEventsMap, DefaultEventsMap>

const currentUser: Ref<User> = ref({
  id: 1,
  username: 'No User Found',
  mmr: 1000,
  isAdmin: true,
  wins: 10,
  losses: 5,
  profilePicture: '../assets/profile.jpeg.',
})

onMounted(async () => {
  checkAuth()
  if (!isLoggedIn.value) {
    router.push('/login')
  }
  let user = await fetchUser()
  if (user) {
    currentUser.value = user
  }

  startSocket()
})

async function startSocket () {
  const jwtToken = Cookies.get('jwtToken')
  socket = io('http://localhost:3000', {
  auth: {
    jwtToken: jwtToken
  }
});
  socket.on("connect", () => {
    console.log(`Connected to the server with Socket ID: ${socket.id}`)
  })

  socket.on('disconnect', (reason) => {
    console.log('WebSocket connection closed', reason)
  })
  socket.io.on('error', (error) => {
    console.error('Socket.IO connection error', error)
  })

  socket.on('search.count', (data) => {
    console.log('Number of players in queue: ', data.count)
  })
  socket.on('game.new', (data) => {
    console.log('New game started: ', data)
    // Handle new game setup here
  })
  socket.on('game.update', (data) => {
    // Update game state based on the received message
  })
  socket.on('game.end', (data) => {
    // Handle game end
  })
  socket.on('error', (errorMsg) => {
    console.error('Error: ', errorMsg)
  })
}

function startGame () {
  if (socket) {
    console.log();('Starting search')
    socket.emit('search')
  } else {
    console.error('Socket not connected')
  
  }
}

</script>

<template>
  <div class="container">
    <div class="left rounded-xl flex flex-col px-16 pt-4">
      <div class="flex justify-start w-full items-end ml-2">
        <div class="text-sm flex flex-col items-center">
          <img
            v-if="currentUser.profilePicture"
            :src="patrick"
            alt="Profilbild"
            class="shadow-md w-10 h-10 rounded-full mt-0"
          >
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            id="profile"
            class="w-8 h-8"
          >
            <g
              fill="
                  none"
              fill-rule="evenodd"
              stroke="#200E32"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              transform="translate(4 2.5)"
            >
              <circle
                cx="7.579"
                cy="4.778"
                r="4.778"
              ></circle>
              <path
                d="M5.32907052e-15,16.2013731 C-0.00126760558,15.8654831 0.0738531734,15.5336997 0.219695816,15.2311214 C0.677361723,14.3157895 1.96797958,13.8306637 3.0389178,13.610984 C3.81127745,13.4461621 4.59430539,13.3360488 5.38216724,13.2814646 C6.84083861,13.1533327 8.30793524,13.1533327 9.76660662,13.2814646 C10.5544024,13.3366774 11.3373865,13.4467845 12.1098561,13.610984 C13.1807943,13.8306637 14.4714121,14.270023 14.929078,15.2311214 C15.2223724,15.8479159 15.2223724,16.5639836 14.929078,17.1807781 C14.4714121,18.1418765 13.1807943,18.5812358 12.1098561,18.7917621 C11.3383994,18.9634099 10.5550941,19.0766219 9.76660662,19.1304349 C8.57936754,19.2310812 7.38658584,19.2494317 6.19681255,19.1853548 C5.92221301,19.1853548 5.65676678,19.1853548 5.38216724,19.1304349 C4.59663136,19.077285 3.8163184,18.9640631 3.04807112,18.7917621 C1.96797958,18.5812358 0.686515041,18.1418765 0.219695816,17.1807781 C0.0745982583,16.8746908 -0.000447947969,16.5401098 5.32907052e-15,16.2013731 Z"
              >
              </path>
            </g>
          </svg>
        </div>
        <div class="ml-2 font-bold">Gegner</div>
        <div class="ml-1">(1000)</div>
      </div>
      <div
        id="tic-tac-toe"
        class="my-8"
      >
        <div
          v-for="(row, rowIndex) in board"
          :key="rowIndex"
          class="row"
        >
          <div
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="cell"
            @click="makeMove(rowIndex, cellIndex)"
          >
            {{ cell }}
          </div>
        </div>
      </div>
      <div class="flex justify-start w-full items-end ml-2">
        <div class="text-sm flex flex-col items-center">
          <img
            v-if="currentUser.profilePicture"
            :src="krabs"
            alt="Profilbild"
            class="shadow-md w-10 h-10 rounded-full mt-0"
          >
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            id="profile"
            class="w-8 h-8"
          >
            <g
              fill="
                  none"
              fill-rule="evenodd"
              stroke="#200E32"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              transform="translate(4 2.5)"
            >
              <circle
                cx="7.579"
                cy="4.778"
                r="4.778"
              ></circle>
              <path
                d="M5.32907052e-15,16.2013731 C-0.00126760558,15.8654831 0.0738531734,15.5336997 0.219695816,15.2311214 C0.677361723,14.3157895 1.96797958,13.8306637 3.0389178,13.610984 C3.81127745,13.4461621 4.59430539,13.3360488 5.38216724,13.2814646 C6.84083861,13.1533327 8.30793524,13.1533327 9.76660662,13.2814646 C10.5544024,13.3366774 11.3373865,13.4467845 12.1098561,13.610984 C13.1807943,13.8306637 14.4714121,14.270023 14.929078,15.2311214 C15.2223724,15.8479159 15.2223724,16.5639836 14.929078,17.1807781 C14.4714121,18.1418765 13.1807943,18.5812358 12.1098561,18.7917621 C11.3383994,18.9634099 10.5550941,19.0766219 9.76660662,19.1304349 C8.57936754,19.2310812 7.38658584,19.2494317 6.19681255,19.1853548 C5.92221301,19.1853548 5.65676678,19.1853548 5.38216724,19.1304349 C4.59663136,19.077285 3.8163184,18.9640631 3.04807112,18.7917621 C1.96797958,18.5812358 0.686515041,18.1418765 0.219695816,17.1807781 C0.0745982583,16.8746908 -0.000447947969,16.5401098 5.32907052e-15,16.2013731 Z"
              >
              </path>
            </g>
          </svg>
        </div>
        <div class="ml-2 font-bold">{{ currentUser.username }}</div>
        <div class="ml-1">({{ currentUser.mmr }})</div>
      </div>
      <button
        @click="startGame"
        to="/play"
        class="bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-xl shadow-md mt-16"
      >
        Neues Spiel beginnen
      </button>
    </div>

    <div class="right rounded-xl">
      <Chat />
    </div>
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e5e5;
  margin-right: 2rem;
  background-color: white;
}

.right {
  flex: 1;
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
