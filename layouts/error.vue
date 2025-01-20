<template>
  <div class="error-page">
    <h1>{{ error.statusCode }} - {{ error.statusMessage }}</h1>
    <p>You are not authorized to view this page.</p>
    <NuxtLink to="/">Go to Homepage</NuxtLink>
  </div>
</template>

<script setup>
const error = useError()
</script>

<style scoped>
.error-page {
  text-align: center;
  padding: 50px;
}
</style>
