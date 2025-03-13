<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  currentFolder: string
}>()

const router = useRouter()

const navigateToFolder = (folder: string) => {
  router.push({ name: 'mail', params: { folder } })
}
</script>

<template>
  <div class="w-64 bg-gray-50 border-r border-gray-200 p-4">
    <div class="mb-4">
      <button
        @click="navigateToFolder('inbox')"
        class="w-full text-left px-4 py-2 rounded hover:bg-gray-200"
        :class="{ 'bg-blue-100': currentFolder === 'inbox' }"
      >
        Inbox
      </button>
      <button
        @click="navigateToFolder('sent')"
        class="w-full text-left px-4 py-2 rounded hover:bg-gray-200"
        :class="{ 'bg-blue-100': currentFolder === 'sent' }"
      >
        Sent
      </button>
      <button
        @click="navigateToFolder('drafts')"
        class="w-full text-left px-4 py-2 rounded hover:bg-gray-200"
        :class="{ 'bg-blue-100': currentFolder === 'drafts' }"
      >
        Drafts
      </button>
    </div>
  </div>
</template>
