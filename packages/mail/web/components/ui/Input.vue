<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validator: (value: string) => ['text', 'email', 'password', 'file'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  error: String,
  disabled: Boolean,
  placeholder: String,
  modelValue: [String, Number, FileList]
})

const emit = defineEmits(['update:modelValue'])

const inputClasses = computed(() => [
  'w-full rounded-md border transition-colors',
  {
    'px-2.5 py-1.5 text-sm': props.size === 'sm',
    'px-3 py-2 text-base': props.size === 'md',
    'px-4 py-3 text-lg': props.size === 'lg',
  },
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
    <input
      :type="type"
      :class="inputClasses"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-sm text-red-500 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>
