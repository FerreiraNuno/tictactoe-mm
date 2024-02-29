<script lang="ts" setup>
import {ref} from 'vue';

const currentUser = ref({
  username: 'JohnDoe',
  profilePicture: 'path/to/profile-picture.jpg',
  mmr: 1000,
  wins: 10,
  losses: 5
});

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
]);

//Ändern des Passworts
const changePassword = () => {
  // TBD
};

//Hochladen des Profilbilds
const uploadProfilePicture = (event) => {
  const file = event.target.files[0];
  // TBD
};
</script>

<template>
  <div v-if="isLoggedIn !== undefined ? isLoggedIn : true">
    <h1 class="text-3xl font-bold pt-4">Mein Profil</h1>
    <div class="container mx-auto flex">
      <div class="container mt-8">
      <div class="rounded-xl flex flex-col px-16 py-8 pl-0 pt-0 pb-0 w-full h-full">
        <div class=" rounded-xl bg-white shadow-md p-4">
          <div class="flex justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold p-0">{{ currentUser.username }}</h2>
              <p>Elo-Zahl: {{ currentUser.mmr }}</p>
            </div>
            <div class="text-sm">
              <img :src="currentUser.profilePicture" alt="Profilbild" class="shadow-md w-24 h-24 rounded-full mt-4 mb-4">
              <a class="text-sm font-semibold text-indigo-600 hover:text-indigo-500" href="#">
                Profilbild wählen
              </a>
            </div>
          </div>
          <div class="">
            <p>Gewonnene Spiele: {{ currentUser.wins }}</p>
            <p>Verlorene Spiele: {{ currentUser.losses }}</p>
          </div>
          <div class="text-sm pt-4">
            <a class="text-sm font-semibold text-indigo-600 hover:text-indigo-500" href="#">
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
        <div id="container" class="rounded-xl bg-white shadow-md p-8 mt-4 mb-4" style="max-height: 300px; overflow-y: auto;">
          <div v-for="game in games" :key="game.id" class="flex justify-between">
            <p>{{ game.opponent }}</p>
            <p>{{ game.result }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Du bist nicht angemeldet.</p>
    <p class="text-center text-sm text-gray-700">
      Bereits Mitglied?
      {{ ' ' }}
      <a class="ml-1 font-bold leading-6 text-indigo-600 hover:text-indigo-500" href="/login">Einloggen</a>
    </p>
  </div>
</template>

<style scoped>
.container {
  width: 80vw;
  height: 80vh;
}
</style>