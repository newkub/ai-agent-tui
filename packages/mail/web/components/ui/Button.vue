<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  loading: Boolean,
  disabled: Boolean,
  iconLeft: String,
  iconRight: String
})

const buttonClasses = computed(() => [
  'flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
  {
    'px-3 py-1.5 text-sm': props.size === 'sm',
    'px-4 py-2 text-base': props.size === 'md',
    'px-6 py-3 text-lg': props.size === 'lg',
  },
  {
    'bg-light-primary-500 text-white hover:bg-light-primary-600 dark:bg-dark-primary-500 dark:hover:bg-dark-primary-600': 
      props.variant === 'primary',
    'bg-light-secondary-500 text-white hover:bg-light-secondary-600 dark:bg-dark-secondary-500 dark:hover:bg-dark-secondary-600': 
      props.variant === 'secondary',
    'border border-light-primary-500 text-light-primary-500 hover:bg-light-primary-50 dark:border-dark-primary-500 dark:text-dark-primary-500 dark:hover:bg-dark-primary-900': 
      props.variant === 'outline',
    'text-light-primary-500 hover:bg-light-primary-50 dark:text-dark-primary-500 dark:hover:bg-dark-primary-900': 
      props.variant === 'ghost',
  },
  {
    'opacity-50 cursor-not-allowed': props.disabled || props.loading
  }
])
</script>

<template>
  <button :class="buttonClasses" :disabled="disabled || loading">
    <span v-if="iconLeft" class="i-[material-symbols--{{iconLeft}}]" />
    <span v-if="loading" class="i-[svg-spinners--90-ring-with-bg] animate-spin" />
    <slot />
    <span v-if="iconRight" class="i-[material-symbols--{{iconRight}}]" />
  </button>
</template>
