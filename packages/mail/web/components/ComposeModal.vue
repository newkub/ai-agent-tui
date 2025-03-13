<script setup lang="ts">
import { ref } from 'vue'

interface NewEmail {
  to: string
  subject: string
  body: string
  attachments: File[]
}

const props = defineProps<{
  show: boolean
  mode: 'new' | 'reply' | 'forward'
  email?: NewEmail
}>()

const emit = defineEmits(['close', 'send'])

const newEmail = ref<NewEmail>({
  to: '',
  subject: '',
  body: '',
  attachments: []
})

const emailError = ref<string | null>(null)

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target && target.files) {
    newEmail.value.attachments = Array.from(target.files)
  }
}

function handleFileDrop(event: DragEvent) {
  if (!event.dataTransfer) return
  const files = event.dataTransfer.files
  if (files) {
    newEmail.value.attachments = Array.from(files)
  }
}

function removeAttachment(index: number) {
  newEmail.value.attachments.splice(index, 1)
}

function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

function handleSend() {
  if (!newEmail.value.to || !newEmail.value.subject || !newEmail.value.body) {
    emailError.value = 'All fields are required'
    return
  }

  if (!validateEmail(newEmail.value.to)) {
    emailError.value = 'Please enter a valid email address'
    return
  }

  emailError.value = null
  emit('send', newEmail.value)
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-8 rounded-lg w-11/12 max-w-600px relative">
      <h2 class="text-xl font-bold">{{ mode === 'reply' ? 'Reply' : mode === 'forward' ? 'Forward' : 'Compose' }}</h2>
      <button class="absolute top-4 right-4 text-2xl border-none bg-transparent cursor-pointer" @click="emit('close')">×</button>
      <form @submit.prevent="handleSend" class="mt-4">
        <div v-if="emailError" class="text-red-500 mb-4">{{ emailError }}</div>
        <div class="mb-4">
          <label for="to" class="block mb-1">To:</label>
          <input v-model="newEmail.to" type="email" required class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label for="subject" class="block mb-1">Subject:</label>
          <input v-model="newEmail.subject" type="text" required class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label for="body" class="block mb-1">Body:</label>
          <textarea v-model="newEmail.body" class="w-full h-200px p-2.5 border border-gray-300 rounded text-base font-sans" @drop.prevent="handleFileDrop" @dragover.prevent></textarea>
        </div>
        <div class="mb-4">
          <label class="block mb-1">Attachments:</label>
          <div class="border-2 border-dashed border-gray-300 p-4 text-center my-4 cursor-pointer hover:bg-gray-50" @drop.prevent="handleFileDrop" @dragover.prevent>
            <p>Drag & drop files here or</p>
            <input type="file" multiple @change="handleFileChange" class="mt-2" />
          </div>
          <ul v-if="newEmail.attachments.length > 0" class="list-disc pl-5">
            <li v-for="(file, index) in newEmail.attachments" :key="file.name" class="flex items-center justify-between">
              {{ file.name }} <button type="button" class="ml-2" @click="removeAttachment(index)">×</button>
            </li>
          </ul>
        </div>
        <button type="submit" class="bg-green-500 text-white px-5 py-2.5 rounded hover:bg-green-600">Send</button>
      </form>
    </div>
  </div>
</template>
