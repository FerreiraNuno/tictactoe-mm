<script setup lang="ts">
import { ref } from 'vue';

const activeForm = ref('login'); // 'login' or 'signup'

const toggleActiveForm = (formName: string) => {
    activeForm.value = formName;
};
</script>

<template>
    <div class="login-container">
        <div class="toggle-buttons">
            <button class="toggle-btn" :class="{ active: activeForm === 'login' }" id="login-btn"
                @click="toggleActiveForm('login')">Login</button>
            <button class="toggle-btn" :class="{ active: activeForm === 'signup' }" id="signup-btn"
                @click="toggleActiveForm('signup')">Sign Up</button>
            <span class="active-indicator" :style="{ left: activeForm === 'signup' ? '50%' : '0' }"></span>
        </div>
        <div class="form">
            <form>
                <div v-if="activeForm === 'signup'" class="input-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" placeholder="Choose a username">
                </div>
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email">
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password">
                </div>
                <div v-if="activeForm === 'signup'" class="input-group">
                    <label for="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" placeholder="Repeat your password">
                </div>
                <div class="submit-btn-container">
                    <button type="submit" class="submit-btn">{{ activeForm === 'login' ? 'Login' : 'Sign Up' }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

  
<style scoped>
.login-container {
    background-color: white;
    padding: 20px;
    margin: auto;
    width: 40vw;
    height: 85vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    position: absolute;
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
}


.toggle-buttons {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 20px;
}

.toggle-btn {
    background-color: transparent;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;
    flex-grow: 1;
    text-align: center;
}

.active-indicator {
    height: 4px;
    width: 50%;
    background-color: black;
    position: absolute;
    bottom: 0;
    left: 0;
    transition: left 0.3s;
}

/* Change the left position based on active button */
#signup-btn.active~.active-indicator {
    left: 50%;
    /* Move under the second button */
}

.form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* Evenly distribute space between form elements */
    flex-grow: 1;
    /* Take available space */
}

.form label {
    color: #2a2a2a;
    display: block;
    margin-bottom: 7px;
    margin-left: 5px;
}

.input-group {
    margin-bottom: 20px;
}

.input-group input {
    width: 100%;
    padding: 15px;
    border: 1px solid #f0f0f0;
    background-color: #f2f2f2;
    border-radius: 15px;
}

.submit-btn-container {
    display: flex;
    justify-content: center;
}

.submit-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 15px;
    background-color: #007BFF;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 50%;
    /* Adjust the width as needed */
}

.submit-btn:hover {
    background-color: #0056b3;
}
</style>
