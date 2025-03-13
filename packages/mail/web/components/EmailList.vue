<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Email } from '@/composables/useEmailActions'

const props = defineProps<{
  emails: Email[]
  sortBy: 'date' | 'sender' | 'subject'
  filterBy: 'all' | 'unread' | 'important'
  searchQuery: string
}>()

const emit = defineEmits(['selectEmail', 'markAsRead'])

const sortedEmails = computed(() => {
  let filtered = props.emails
  if (props.filterBy === 'unread') {
    filtered = filtered.filter(email => !email.read)
  } else if (props.filterBy === 'important') {
    filtered = filtered.filter(email => email.important)
  }

  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    filtered = filtered.filter(email => 
      email.from.toLowerCase().includes(query) ||
      email.subject.toLowerCase().includes(query) ||
      email.content.toLowerCase().includes(query)
    )
  }

  return filtered.sort((a, b) => {
    if (props.sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (props.sortBy === 'sender') {
      return a.from.localeCompare(b.from)
    } else {
      return a.subject.localeCompare(b.subject)
    }
  })
})

const currentPage = ref(1)
const itemsPerPage = ref(10)

const paginatedEmails = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedEmails.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(sortedEmails.value.length / itemsPerPage.value)
})

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
</script>

<template>
  <div class="flex flex-col h-full bg-primary-50">
    <div class="flex-1 overflow-y-auto border-r border-gray-100">
      <div
        v-for="email in paginatedEmails"
        :key="email.id"
        class="p-md border-b border-gray-100 cursor-pointer flex flex-col gap-sm hover:bg-gray-50 transition-colors"
        :class="{ 'opacity-70': email.read, 'border-l-3 border-l-yellow-400': email.important }"
        @click="emit('selectEmail', email); emit('markAsRead', email.id)"
      >
        <div class="font-sans font-medium text-gray-900">{{ email.from }}</div>
        <div class="text-sm text-gray-600">{{ email.subject }}</div>
        <div class="text-xs text-gray-500">{{ email.content.slice(0, 100) }}</div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex justify-center items-center p-md border-t border-gray-100">
      <button
        class="px-md py-sm mr-sm text-sm bg-white rounded-lg shadow-sm hover:bg-gray-50"
        @click="prevPage"
        :disabled="currentPage === 1"
      >
        Previous
      </button>
      <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        class="px-md py-sm ml-sm text-sm bg-white rounded-lg shadow-sm hover:bg-gray-50"
        @click="nextPage"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>
  </div>
</template>
