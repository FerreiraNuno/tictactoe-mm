<script setup lang="ts">

let isLoggedIn: boolean = true;

</script>

<template>
  <header className="absolute inset-x-0 top-0 z-50">
    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div className="flex lg:flex-1">
        <a href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Your Company</span>
          <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
        </a>
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <a v-if="isLoggedIn" href="/" className="font-semibold text-gray-900">
          Log out <span aria-hidden="true">&rarr;</span>
        </a>
        <a v-else href="/login" className="font-semibold text-gray-900">
          Log in <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </nav>
  </header>
  <router-view />
</template>

<style scoped></style>