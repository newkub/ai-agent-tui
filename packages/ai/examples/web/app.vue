<script setup lang='ts'>
import { ref } from 'vue'

interface Example {
  id: number
  name: string
  description: string
  provider: string
}

const examples = ref<Example[]>([
  {
    id: 1,
    name: 'Example 1',
    description: 'Text generation example',
    provider: 'OpenAI'
  },
  {
    id: 2,
    name: 'Example 2',
    description: 'Image generation example',
    provider: 'Deepseek'
  }
])
</script>

<template>
  <table class='w-full divide-y divide-gray-200'>
    <thead>
      <tr>
        <th class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
          Name
        </th>
        <th class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
          Description
        </th>
        <th class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
          Provider
        </th>
      </tr>
    </thead>
    <tbody class='divide-y divide-gray-200'>
      <tr v-for='example in examples' :key='example.id'>
        <td class='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
          {{ example.name }}
        </td>
        <td class='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
          {{ example.description }}
        </td>
        <td class='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
          {{ example.provider }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
