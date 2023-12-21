<script setup lang="ts">
</script>
<template>
    <div class="container">
        <div class="left"></div>
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
    position: absolute;
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%);
}

.left {
    width: 75vh;
}

.right {
    flex-grow: 1;
    background-color: #f0f0f0;
    min-width: 15em;
}
</style>
