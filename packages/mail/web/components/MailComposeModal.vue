<script setup lang="ts">
import type { NewMail } from '@/types/mail'

defineProps<{
  modelValue: boolean
  mail: NewMail
}>()

const emit = defineEmits(['update:modelValue', 'send', 'attach'])
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-xl"
    >
      <div class="bg-white rounded-lg shadow-2xl w-full max-w-3xl">
        <div class="p-md border-b border-gray-100">
          <h3 class="text-lg font-sans font-semibold text-gray-900">New Message</h3>
        </div>
        <div class="p-md space-y-md">
          <input 
            v-model="mail.to" 
            type="text" 
            placeholder="To" 
            class="w-full p-sm border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
          <input 
            v-model="mail.subject" 
            type="text" 
            placeholder="Subject" 
            class="w-full p-sm border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
          <textarea 
            v-model="mail.content" 
            class="w-full p-sm border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
            rows="10"
          ></textarea>
          <input 
            type="file" 
            multiple 
            @change="emit('attach', $event)" 
            class="w-full p-sm border border-gray-200 rounded-lg"
          >
        </div>
        <div class="p-md border-t border-gray-100 flex justify-end space-x-md">
          <button 
            @click="emit('update:modelValue', false)" 
            class="px-lg py-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button 
            @click="emit('send')" 
            class="px-lg py-sm bg-primary-500 text-white rounded-lg shadow-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
