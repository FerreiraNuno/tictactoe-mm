<script
  lang="ts"
  setup
>
import Cookies from 'js-cookie'
import { onMounted, ref, type Ref } from 'vue'

// define user type
interface User {
  id: number
  username: string
  mmr: number
  isAdmin: boolean
  wins: number
  losses: number
  profilePicture: string
}


const currentUser: Ref<User> = ref({
  id: 1,
  username: 'No User Found',
  mmr: 1000,
  isAdmin: true,
  wins: 10,
  losses: 5,
  profilePicture: '../assets/profile.jpeg.',
})


async function fetchUserData () {
  try {
    const jwtToken = Cookies.get('jwtToken') // Assuming you're using js-cookie or a similar library

    // Check if the token exists
    if (!jwtToken) {
      throw new Error('Authentication token not found. Please login first.')
    }

    // Make a GET request to the user endpoint
    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwtToken}`, // Use the JWT token for authorization
        'Content-Type': 'application/json',
      },
    })
    // Check if the response was successful
    if (!response.ok) {
      throw new Error('Failed to fetch user data. Please check your authentication token.')
    }
    const userData = await response.json()
    // parse first 4 items of the response into currentUser
    currentUser.value = {
      id: userData.id,
      username: userData.username,
      mmr: userData.mmr,
      isAdmin: userData.isAdmin,
      wins: 10,
      losses: 5,
      profilePicture: userData.profilePicture,
    }

  } catch (error: any) {
    console.error('Error:', error.message)
    // Handle errors or failed requests appropriately in your application
  }
}

onMounted(async () => {
  const userData = await fetchUserData()
})

const games = ref([
  { id: 1, opponent: 'Spieler A', result: 'Gewonnen' },
  { id: 2, opponent: 'Spieler B', result: 'Verloren' },
  { id: 3, opponent: 'Spieler C', result: 'Unentschieden' },
  { id: 4, opponent: 'Spieler D', result: 'Gewonnen' },
  { id: 5, opponent: 'Spieler E', result: 'Verloren' },
  { id: 6, opponent: 'Spieler F', result: 'Unentschieden' },
  { id: 7, opponent: 'Spieler G', result: 'Gewonnen' },
  { id: 8, opponent: 'Spieler H', result: 'Verloren' },
  { id: 9, opponent: 'Spieler I', result: 'Unentschieden' },
  { id: 10, opponent: 'Spieler J', result: 'Gewonnen' },
  { id: 11, opponent: 'Spieler K', result: 'Verloren' },
  { id: 12, opponent: 'Spieler L', result: 'Unentschieden' },
  { id: 13, opponent: 'Spieler M', result: 'Gewonnen' },
  { id: 14, opponent: 'Spieler N', result: 'Verloren' },
  { id: 15, opponent: 'Spieler O', result: 'Unentschieden' }
])

//Ändern des Passworts
const changePassword = () => {
  // TBD
}

//Hochladen des Profilbilds
const uploadProfilePicture = () => {
  // TBD
}
</script>

<template>
  <h1 class="text-3xl font-bold pt-4">Mein Profil</h1>
  <div class="container mx-auto flex items-center justify-center p-2">
    <div class="container mt-8">
      <div class="rounded-xl flex flex-col px-16 py-8 pl-0 pt-0 pb-0 w-full h-full">
        <h2 class="text-2xl font-bold mb-4">Benutzer</h2>
        <div class=" rounded-xl bg-white shadow-md p-4">
          <div class="flex justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold p-0">{{ currentUser.username }}</h2>
              <p>Elo-Zahl: {{ currentUser.mmr }}</p>
            </div>
            <div class="text-sm flex flex-col items-center p-8">
              <img
                v-if="false"
                :src="currentUser.profilePicture"
                alt="Profilbild"
                class="shadow-md w-24 h-24 rounded-full mt-4 mb-4"
              >
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                id="profile"
                class="w-24 h-24 rounded-full mt-4 mb-4 border-2 border-black p-2"
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
              <a
                class="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                href="
                  #"
              >
                Profilbild wählen
              </a>
            </div>
          </div>
          <div class="">
            <p>Gewonnene Spiele: {{ currentUser.wins }}</p>
            <p>Verlorene Spiele: {{ currentUser.losses }}</p>
          </div>
          <div class="text-sm pt-4">
            <a
              class="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              href="#"
            >
              Passwort ändern
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="container mt-8 ">
      <h2 class="text-2xl font-bold mb-4">Stats</h2>
      <div class=" rounded-xl bg-white shadow-md p-8 mt-4 mb-4 flex w-full justify-between">
        <p>Spiele gespielt: {{ currentUser.wins + currentUser.losses }}</p>
        <p>Winrate: {{ (currentUser.wins / (currentUser.wins + currentUser.losses) * 100).toFixed(2) }}%</p>
      </div>
      <h2 class="text-2xl font-bold">Spiele</h2>
      <div
        id="container"
        class="rounded-xl bg-white shadow-md p-8 mt-4 mb-4"
        style="max-height: 300px; overflow-y: auto;"
      >
        <div
          v-for="game in games"
          :key="game.id"
          class="flex justify-between p-1"
        >
          <p>{{ game.opponent }}</p>
          <p>{{ game.result }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 85vw;
  height: 80vh;
}
</style>