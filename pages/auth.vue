<template>
  <div id="auth-page">
    <div id="login" style="display: none;"></div>
    <div id="register" style="display: none;"></div>
    <div class="container" :class="{ active: !showLoginForm }">
      <!-- Form Login -->
      <div v-if="showLoginForm" class="form-box login">
        <form @submit.prevent="handleLogin">
          <h1 class="font-bold">Login</h1>
          <div class="input-box">
            <input
              v-model="loginEmail"
              type="email"
              placeholder="Email"
              required
            />
            <i class="bx bxs-envelope"></i>
          </div>
          <div class="input-box">
            <input
              v-model="loginPassword"
              type="password"
              placeholder="Password"
              required
            />
            <i class="bx bxs-lock-alt"></i>
          </div>
          <div class="forgot-link">
            <NuxtLink to="/auth#login">Forget Password</NuxtLink>
          </div>
          <button type="submit" class="btn">Login</button>
        </form>
      </div>

      <!-- Form Register -->
      <div class="form-box register">
        <form @submit.prevent="handleRegister">
          <h1 class="font-bold">Registration</h1>
          <div class="input-box">
            <input
              v-model="registerEmail"
              type="email"
              placeholder="Email"
              required
            />
            <i class="bx bxs-envelope"></i>
          </div>
          <div class="input-box">
            <input
              v-model="registerPassword"
              type="password"
              placeholder="Password"
              required
            />
            <i class="bx bxs-lock-alt"></i>
          </div>
          <div class="input-box">
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
            />
            <i class="bx bxs-lock-alt"></i>
          </div>
          <button type="submit" class="btn">Register</button>
        </form>
      </div>

      <div class="toggle-box">
        <div class="toggle-panel toggle-left">
          <NuxtLink to="/">
            <img
              src="~/assets/logo/morent-white-logo.svg"
              alt="logo"
              style="height: 15px; margin-bottom: 50px"
            />
          </NuxtLink>
          <h1 class="hide font-bold">Welcome Back!</h1>
          <p>Don't have an account?</p>
          <button class="btn register-btn" @click="toggleForm">Register</button>
        </div>
        <div class="toggle-panel toggle-right">
          <NuxtLink to="/">
            <img
              src="~/assets/logo/morent-white-logo.svg"
              alt="logo"
              style="height: 15px; margin-bottom: 50px"
            />
          </NuxtLink>
          <h1 class="hide font-bold">Hello, Welcome!</h1>
          <p>Already have an account?</p>
          <button class="btn login-btn" @click="toggleForm">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from '~/utils/alert'
import { register, login } from '~/utils/auth'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

const router = useRouter()

// Form data for Login
const loginEmail = ref('')
const loginPassword = ref('')

// Form data for Register
const registerEmail = ref('')
const registerPassword = ref('')
const confirmPassword = ref('')

// State to toggle between login and register forms
const showLoginForm = ref(true)

// Toggle between login and register forms
const toggleForm = () => {
  showLoginForm.value = !showLoginForm.value
  window.location.hash = showLoginForm.value ? 'login' : 'register'
}

// Handle login form submission
const handleLogin = async () => {
  if (!loginEmail.value || !loginPassword.value) {
    toast('Please fill out all required fields.', 'error')
    return
  }

  if (await login(loginEmail.value, loginPassword.value)) {
    // await syncFavorites()
    router.push('/')
  }
}

// Handle registration form submission
const handleRegister = async () => {
  if (
    !registerEmail.value ||
    !registerPassword.value ||
    !confirmPassword.value
  ) {
    toast('Please fill out all required fields.', 'error')
    return
  }

  if (registerPassword.value !== confirmPassword.value) {
    toast('Passwords do not match.', 'error')
    return
  }

  if (await register(registerEmail.value, registerPassword.value)) {
    registerEmail.value = ''
    registerPassword.value = ''
    confirmPassword.value = ''
    toggleForm()
  }
}

onMounted(() => {
  showLoginForm.value = window.location.hash !== '#register'
  window.location.hash = showLoginForm.value ? 'login' : 'register'
})
</script>

<style scoped>
@import '~/assets/css/auth.css';
@import url(https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css);
</style>
