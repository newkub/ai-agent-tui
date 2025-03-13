<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  position: {
    type: String,
    default: 'center',
    validator: (value: string) => ['center', 'top', 'bottom'].includes(value)
  },
  show: Boolean
})

const emit = defineEmits(['close'])

const modalClasses = computed(() => [
  'fixed inset-0 z-50 flex',
  {
    'items-center justify-center': props.position === 'center',
    'items-start pt-10': props.position === 'top',
    'items-end pb-10': props.position === 'bottom',
  }
])

const contentClasses = computed(() => [
  'bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg',
  'border border-light-primary-300 dark:border-dark-primary-700',
  {
    'max-w-sm': props.size === 'sm',
    'max-w-md': props.size === 'md',
    'max-w-lg': props.size === 'lg',
  }
])
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50" 
        @click="emit('close')"
      />

      <!-- Modal -->
      <div :class="modalClasses">
        <div :class="contentClasses">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
