<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: String,
  maxLength: Number,
  error: String,
  disabled: Boolean,
  placeholder: String,
  showMarkdownPreview: Boolean
})

const emit = defineEmits(['update:modelValue'])

const characterCount = computed(() => props.modelValue?.length || 0)
const remainingCharacters = computed(() => 
  props.maxLength ? props.maxLength - characterCount.value : null
)

const textareaClasses = computed(() => [
  'w-full min-h-[100px] rounded-md border transition-colors',
  'px-3 py-2 text-base resize-y',
  {
    'border-light-primary-300 focus:border-light-primary-500 focus:ring-light-primary-500 dark:border-dark-primary-700 dark:focus:border-dark-primary-500 dark:focus:ring-dark-primary-500': 
      !props.error,
    'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500': 
      props.error,
  },
  {
    'bg-light-surface text-light-text placeholder-light-text/50 dark:bg-dark-surface dark:text-dark-text dark:placeholder-dark-text/50': 
      !props.disabled,
    'bg-light-surface/50 text-light-text/50 cursor-not-allowed dark:bg-dark-surface/50 dark:text-dark-text/50': 
      props.disabled,
  }
])
</script>

<template>
  <div class="space-y-1">
    <textarea
      :class="textareaClasses"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <div v-if="maxLength" class="flex justify-end text-sm text-light-text/50 dark:text-dark-text/50">
      {{ remainingCharacters }} characters remaining
    </div>
    <p v-if="error" class="text-sm text-red-500 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>
