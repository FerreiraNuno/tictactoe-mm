<script setup lang="ts">
import GameView from "./components/GameView.vue";
import LoginModal from "./components/LoginModal.vue";

let isLoggedIn: boolean = true;
</script>

<template>
  <GameView v-if="isLoggedIn" />
  <LoginModal v-else />
</template>

<style scoped></style>