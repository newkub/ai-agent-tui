<template>
  <aside class="sidebar">
    <div class="folders">
      <div class="folder" v-for="folder in folders" :key="folder">
        {{ folder }}
      </div>
    </div>
    <div class="settings">
      <button>Settings</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const folders = ['Inbox', 'Sent', 'Drafts', 'Spam', 'Trash']
</script>

<style scoped>
.sidebar {
  background-color: #f8fafc;
  padding: 1rem;
}

.folders {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.folder {
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.folder:hover {
  background-color: #e2e8f0;
}

.settings {
  margin-top: auto;
}
</style>
