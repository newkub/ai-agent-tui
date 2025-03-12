<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { type AgentConfig, defaultConfig } from './data/examples'

// Data structure with nested properties support
interface Property {
  name: string
  type: string
  expanded: boolean
  description?: string
  defaultValue?: any
  children?: Property[]
}

interface TypeConstruct {
  name: string
  type: string
  description?: string
  properties: Property[]
  expanded: boolean
}

// Create a more detailed data structure with nested properties
const tsConstructs = ref<TypeConstruct[]>([
  {
    name: 'AgentConfig',
    type: 'interface',
    description: 'Configuration options for the agent',
    expanded: true,
    properties: Object.keys(defaultConfig).map(key => {
      const value = defaultConfig[key as keyof AgentConfig]
      return {
        name: key,
        type: typeof value,
        expanded: false,
        defaultValue: value,
        description: getDescriptionFor(key),
        children: typeof value === 'object' && value !== null ? 
          Object.keys(value).map(childKey => ({
            name: childKey,
            type: typeof value[childKey as keyof typeof value],
            expanded: false,
            defaultValue: value[childKey as keyof typeof value]
          })) : undefined
      }
    })
  }
])

// Helper function to provide descriptions (you can replace with actual descriptions)
function getDescriptionFor(key: string): string {
  const descriptions: Record<string, string> = {
    baseUrl: 'The base URL for API requests',
    timeout: 'Request timeout in milliseconds',
    retries: 'Number of retry attempts for failed requests',
    debug: 'Enable debug mode for additional logging',
    apiKey: 'API authentication key',
    // Add more descriptions as needed
  }
  return descriptions[key] || 'No description available'
}

// Set up filtering
const searchQuery = ref('')
const filterType = ref('all')

// Set up sorting
const sortBy = ref('name')
const sortDirection = ref('asc')

// Active construct for mobile view
const activeConstructIndex = ref(0)

// View mode (table, card, tree)
const viewMode = ref('tree')

// Theme toggle
const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

// Filter and sort constructs
const filteredConstructs = computed(() => {
  return tsConstructs.value.filter(construct => {
    const nameMatch = construct.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const typeMatch = filterType.value === 'all' || construct.type === filterType.value
    return nameMatch && typeMatch
  })
})

const sortedConstructs = computed(() => {
  return [...filteredConstructs.value].sort((a, b) => {
    const modifier = sortDirection.value === 'asc' ? 1 : -1
    if (a[sortBy.value] < b[sortBy.value]) return -1 * modifier
    if (a[sortBy.value] > b[sortBy.value]) return 1 * modifier
    return 0
  })
})

// Toggle functions
function toggleSort(column: string) {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'asc'
  }
}

function toggleConstruct(index: number) {
  tsConstructs.value[index].expanded = !tsConstructs.value[index].expanded
}

function toggleProperty(constructIndex: number, propIndex: number) {
  const prop = tsConstructs.value[constructIndex].properties[propIndex]
  prop.expanded = !prop.expanded
}

function toggleChildProperty(constructIndex: number, propIndex: number, childIndex: number) {
  const children = tsConstructs.value[constructIndex].properties[propIndex].children
  if (children) {
    children[childIndex].expanded = !children[childIndex].expanded
  }
}

// Get type color based on type
function getTypeColor(type: string): string {
  const colors = {
    string: 'text-green-600',
    number: 'text-blue-600',
    boolean: 'text-purple-600',
    object: 'text-orange-600',
    function: 'text-red-600',
    undefined: 'text-gray-600',
    'null': 'text-gray-600'
  }
  return colors[type as keyof typeof colors] || 'text-gray-800'
}

// Get type icon based on type
function getTypeIcon(type: string): string {
  const icons = {
    string: 'i-carbon-string-text',
    number: 'i-carbon-number',
    boolean: 'i-carbon-boolean',
    object: 'i-carbon-object',
    function: 'i-carbon-function',
    interface: 'i-carbon-data-class',
    type: 'i-carbon-data-type',
    undefined: 'i-carbon-undefined',
    'null': 'i-carbon-null'
  }
  return icons[type as keyof typeof icons] || 'i-carbon-code'
}
</script>

<template>
  <div class="p-4 md:p-6 max-w-full mx-auto bg-gray-50 min-h-screen" :class="{ 'dark': isDark }">
    <header class="mb-6">
      <h1 class="text-3xl font-bold mb-2 text-gray-800 flex items-center gap-2">
        <div class="i-carbon-typescript text-blue-600 text-4xl"></div>
        TypeScript Visualizer
      </h1>
      <p class="text-gray-600 mb-4">Interactive visualization of TypeScript interfaces, types, and classes</p>
      
      <!-- Controls -->
      <div class="flex flex-wrap gap-4 mb-4 items-center">
        <!-- Search -->
        <div class="flex-grow max-w-md relative">
          <div class="i-carbon-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search by name..."
            class="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
        </div>
        
        <!-- Type filter -->
        <div class="flex gap-2 items-center">
          <label class="text-sm text-gray-600">Type:</label>
          <select 
            v-model="filterType"
            class="py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
          >
            <option value="all">All types</option>
            <option value="interface">Interface</option>
            <option value="type">Type</option>
            <option value="class">Class</option>
            <option value="enum">Enum</option>
          </select>
        </div>
        
        <!-- View mode -->
        <div class="flex gap-1 items-center">
          <button 
            @click="viewMode = 'tree'" 
            class="p-2 rounded-lg transition" 
            :class="viewMode === 'tree' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'"
          >
            <div class="i-carbon-tree-view"></div>
          </button>
          <button 
            @click="viewMode = 'card'" 
            class="p-2 rounded-lg transition" 
            :class="viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'"
          >
            <div class="i-carbon-cards"></div>
          </button>
          <button 
            @click="viewMode = 'table'" 
            class="p-2 rounded-lg transition" 
            :class="viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'"
          >
            <div class="i-carbon-table"></div>
          </button>
        </div>
      </div>
    </header>

    <!-- No results -->
    <div v-if="sortedConstructs.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-500">
      <div class="i-carbon-no-content text-5xl mb-4"></div>
      <p class="text-lg mb-2">No TypeScript constructs found</p>
      <p>Try adjusting your search or filters</p>
    </div>

    <!-- Tree View -->
    <div v-else-if="viewMode === 'tree'" class="space-y-4">
      <div 
        v-for="(construct, constructIndex) in sortedConstructs" 
        :key="construct.name"
        class="bg-white rounded-xl shadow-sm overflow-hidden transition border border-gray-200 hover:shadow"
      >
        <!-- Construct header -->
        <div 
          class="flex items-center gap-2 p-4 cursor-pointer"
          @click="toggleConstruct(constructIndex)"
          :class="construct.expanded ? 'border-b border-gray-200' : ''"
        >
          <div :class="[getTypeIcon(construct.type), 'text-blue-600 text-xl']"></div>
          <div class="flex-grow">
            <div class="font-medium text-lg">{{ construct.name }}</div>
            <div class="text-sm text-gray-500 mt-1">{{ construct.description }}</div>
          </div>
          <div class="text-sm rounded-full px-3 py-1 bg-blue-100 text-blue-800">{{ construct.type }}</div>
          <div 
            :class="construct.expanded ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'"
            class="text-gray-400"
          ></div>
        </div>

        <!-- Properties -->
        <div v-if="construct.expanded" class="p-4 bg-gray-50">
          <ul class="space-y-2">
            <li 
              v-for="(prop, propIndex) in construct.properties" 
              :key="prop.name"
              class="list-none"
            >
              <!-- Property row -->
              <div 
                class="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                @click="toggleProperty(constructIndex, propIndex)"
              >
                <div 
                  :class="prop.expanded ? 'i-carbon-chevron-down' : 'i-carbon-chevron-right'"
                  class="text-gray-400 w-5"
                ></div>
                <div :class="[getTypeIcon(prop.type), getTypeColor(prop.type)]"></div>
                <div class="font-medium text-gray-800">{{ prop.name }}</div>
                <div :class="['text-sm', getTypeColor(prop.type)]">: {{ prop.type }}</div>
                <div v-if="prop.defaultValue !== undefined" class="text-sm text-gray-500 ml-2">
                  = {{ JSON.stringify(prop.defaultValue) }}
                </div>
              </div>

              <!-- Property details -->
              <div v-if="prop.expanded" class="ml-8 mt-2 space-y-2">
                <div class="text-sm text-gray-600 p-2 bg-white rounded-lg">
                  {{ prop.description || 'No description available' }}
                </div>
                
                <!-- Child properties if any -->
                <ul v-if="prop.children && prop.children.length > 0" class="space-y-1 mt-2">
                  <li 
                    v-for="(child, childIndex) in prop.children" 
                    :key="child.name"
                    class="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition"
                  >
                    <div :class="[getTypeIcon(child.type), getTypeColor(child.type)]"></div>
                    <div class="font-medium text-gray-700">{{ child.name }}</div>
                    <div :class="['text-sm', getTypeColor(child.type)]">: {{ child.type }}</div>
                    <div v-if="child.defaultValue !== undefined" class="text-sm text-gray-500 ml-2">
                      = {{ JSON.stringify(child.defaultValue) }}
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Card View -->
    <div v-else-if="viewMode === 'card'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="(construct, constructIndex) in sortedConstructs" 
        :key="construct.name"
        class="bg-white rounded-xl shadow-sm overflow-hidden transition border border-gray-200 hover:shadow-md"
      >
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center gap-2">
            <div :class="[getTypeIcon(construct.type), 'text-blue-600 text-xl']"></div>
            <div class="font-medium text-lg">{{ construct.name }}</div>
          </div>
          <div class="text-sm text-gray-500 mt-2">{{ construct.description }}</div>
          <div class="flex justify-between items-center mt-3">
            <div class="text-sm rounded-full px-3 py-1 bg-blue-100 text-blue-800">{{ construct.type }}</div>
            <div class="text-sm text-gray-500">{{ construct.properties.length }} properties</div>
          </div>
        </div>
        
        <ul class="p-3 max-h-64 overflow-y-auto">
          <li 
            v-for="(prop, propIndex) in construct.properties" 
            :key="prop.name"
            class="py-2 px-3 hover:bg-gray-50 rounded-lg transition flex items-center gap-2"
          >
            <div :class="[getTypeIcon(prop.type), getTypeColor(prop.type)]"></div>
            <div class="font-medium text-gray-800">{{ prop.name }}</div>
            <div :class="['text-sm', getTypeColor(prop.type)]">: {{ prop.type }}</div>
          </li>
        </ul>
        
        <div class="p-3 border-t border-gray-200 bg-gray-50">
          <button 
            @click="toggleConstruct(constructIndex)" 
            class="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition flex items-center justify-center gap-2"
          >
            <span>{{ construct.expanded ? 'Hide Details' : 'Show Details' }}</span>
            <div :class="construct.expanded ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Table View (Original improved) -->
    <div v-else-if="viewMode === 'table'" class="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <table class="w-full bg-white">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th 
              @click="toggleSort('name')"
              class="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition"
            >
              <div class="flex items-center gap-2">
                <span>Name</span>
                <div 
                  v-if="sortBy === 'name'" 
                  :class="sortDirection === 'asc' ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'"
                ></div>
              </div>
            </th>
            <th 
              @click="toggleSort('type')"
              class="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition"
            >
              <div class="flex items-center gap-2">
                <span>Type</span>
                <div 
                  v-if="sortBy === 'type'" 
                  :class="sortDirection === 'asc' ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'"
                ></div>
              </div>
            </th>
            <th class="px-4 py-3 text-left">Properties</th>
            <th class="px-4 py-3 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(construct, constructIndex) in sortedConstructs" 
            :key="construct.name"
            class="border-b border-gray-200 hover:bg-gray-50 transition"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <div :class="[getTypeIcon(construct.type), 'text-blue-600']"></div>
                <span class="font-medium">{{ construct.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2 py-1 text-xs bg-blue-100 text-blue-800">
                {{ construct.type }}
              </span>
            </td>
            <td class="px-4 py-3">
              <ul class="space-y-1 max-h-40 overflow-y-auto pr-2">
                <li 
                  v-for="prop in construct.properties.slice(0, 3)" 
                  :key="prop.name"
                  class="flex items-center gap-1 text-sm"
                >
                  <div :class="[getTypeIcon(prop.type), getTypeColor(prop.type), 'text-sm']"></div>
                  <span class="font-medium">{{ prop.name }}</span>
                  <span :class="getTypeColor(prop.type)">: {{ prop.type }}</span>
                </li>
                <li v-if="construct.properties.length > 3" class="text-sm text-gray-500">
                  +{{ construct.properties.length - 3 }} more properties
                </li>
              </ul>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ construct.description }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Floating add button -->
    <button class="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition">
      <div class="i-carbon-add text-2xl"></div>
    </button>

    <!-- Theme toggle button -->
    <button 
      @click="toggleTheme"
      class="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
    >
      {{ isDark ? '🌞' : '🌙' }}
    </button>
  </div>
</template>
