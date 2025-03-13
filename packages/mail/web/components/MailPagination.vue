<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits(['prev', 'next'])
</script>

<template>
  <div class="flex justify-center items-center p-md border-t border-gray-100">
    <button
      class="px-md py-sm mr-sm text-sm bg-white rounded-lg shadow-sm hover:bg-gray-50"
      @click="emit('prev')"
    >
      Previous
    </button>
    <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
    <button
      class="px-md py-sm ml-sm text-sm bg-white rounded-lg shadow-sm hover:bg-gray-50"
      @click="emit('next')"
    >
      Next
    </button>
  </div>
</template>
