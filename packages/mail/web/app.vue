<template>
  <div :class="{ 'dark': isDark }" class="flex flex-col h-screen">
    <NavBar />
    <div class="flex-1 p-5 bg-gray-100">
      <MailClient />
    </div>
    <button
      @click="toggleTheme"
      class="fixed bottom-md right-md p-sm bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow"
    >
      <span v-if="!isDark" class="i-ph-moon-stars-fill text-xl text-gray-800 dark:text-gray-200" />
      <span v-else class="i-ph-sun-fill text-xl text-gray-200 dark:text-gray-800" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './layout/NavBar.vue'
import MailClient from './components/MailClient.vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>
