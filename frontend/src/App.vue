<script setup lang="ts">
import GameView from "./components/GameView.vue";
import LoginModal from "./components/LoginModal.vue";

let isLoggedIn: boolean = false;
</script>

<template>
  <div class="sidebar">
    <div class="button">
      Login
    </div>
    <div class="button">
      Register
    </div>
  </div>

  <GameView v-if="isLoggedIn" />
  <LoginModal v-else />
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 20vw;
  height: 100vh;
  overflow-y: auto;
  background-color: #fff;
  padding: 10px;
  padding-top: 5vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar .button {
  width: 80%;
  margin-bottom: 10px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #007BFF;
  color: #fff;
  text-align: center;
  padding: 10px 0;
  transition: background-color 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
}

.sidebar .button:hover {
  background-color: #0056b3;
}
</style>