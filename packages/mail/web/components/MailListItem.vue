<script setup lang="ts">
import type { Mail } from '@/types/mail'

defineProps<{
  mail: Mail
  isSelected: boolean
}>()

const emit = defineEmits(['select'])
</script>

<template>
  <div
    class="p-md border-b border-gray-100 cursor-pointer flex flex-col gap-sm hover:bg-gray-50 transition-colors"
    :class="{ 'bg-gray-50': isSelected }"
    @click="emit('select')"
  >
    <div class="flex items-center gap-md">
      <div class="flex-1">
        <p class="font-sans font-medium text-gray-900">{{ mail.fromName }}</p>
        <p class="text-sm text-gray-600">{{ mail.subject }}</p>
      </div>
      <div class="text-sm text-gray-500">
        {{ mail.date }} {{ mail.time }}
      </div>
    </div>
  </div>
</template>
