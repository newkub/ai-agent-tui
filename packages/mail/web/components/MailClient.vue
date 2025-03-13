<template>
  <div class="flex h-screen bg-primary-50">
    <SidebarNavigation :current-folder="currentFolder" />
    <div class="flex-1 flex flex-col p-xl gap-xl">
      <div class="bg-white rounded-lg shadow-md p-md">
        <div class="flex items-center gap-md">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search emails..."
            class="flex-1 p-sm border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
          <button 
            @click="showComposeModal = true"
            class="bg-primary-500 hover:bg-primary-600 text-white px-lg py-sm rounded-lg shadow-sm"
          >
            New Email
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="divide-y divide-gray-100">
          <MailListItem
            v-for="mail in paginatedMails"
            :key="mail.id"
            :mail="mail"
            :is-selected="mail.id === selectedMail?.id"
            @select="selectedMail = mail"
          />
        </div>
      </div>

      <MailPagination
        v-if="filteredMails.length > itemsPerPage"
        :current-page="currentPage"
        :total-pages="Math.ceil(filteredMails.length / itemsPerPage)"
        @prev="currentPage = Math.max(1, currentPage - 1)"
        @next="currentPage = Math.min(Math.ceil(filteredMails.length / itemsPerPage), currentPage + 1)"
      />

      <MailComposeModal
        v-model="showComposeModal"
        :mail="newMail"
        @send="sendMail(mails)"
        @attach="handleAttachments"
      />

      <div v-if="selectedMail" class="bg-white rounded-lg shadow-md p-md">
        <div class="flex items-center gap-md mb-md">
          <button @click="toggleStarred(selectedMail)" class="p-2 hover:bg-gray-100 rounded">
            {{ selectedMail.starred ? '★' : '☆' }}
          </button>
          <button @click="toggleImportant(selectedMail)" class="p-2 hover:bg-gray-100 rounded">
            {{ selectedMail.important ? '!' : 'i' }}
          </button>
          <button @click="replyMail(selectedMail)" class="p-2 hover:bg-gray-100 rounded">Reply</button>
          <button @click="forwardMail(selectedMail)" class="p-2 hover:bg-gray-100 rounded">Forward</button>
          <button @click="deleteMail(selectedMail)" class="p-2 hover:bg-gray-100 rounded">Delete</button>
        </div>
        <h2 class="text-lg font-sans font-semibold text-gray-900 mb-md">{{ selectedMail.subject }}</h2>
        <div class="text-sm text-gray-500 mb-md">
          From: {{ selectedMail.fromName }} ({{ selectedMail.from }}) | Date: {{ selectedMail.date }} {{ selectedMail.time }}
        </div>
        <div class="prose">{{ selectedMail.content }}</div>
        <div v-if="selectedMail.attachments" class="mt-md">
          <h3 class="text-lg font-sans font-semibold text-gray-900 mb-md">Attachments</h3>
          <ul>
            <li v-for="attachment in selectedMail.attachments" :key="attachment.name">
              {{ attachment.name }} ({{ attachment.size }})
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SidebarNavigation from './SidebarNavigation.vue'
import MailListItem from './MailListItem.vue'
import MailComposeModal from './MailComposeModal.vue'
import MailPagination from './MailPagination.vue'
import { useMailList } from '@/composables/useMailList'
import { useMailCompose } from '@/composables/useMailCompose'
import type { Mail } from '@/types/mail'

const router = useRouter()

const navigateToFolder = (folder: string) => {
  router.push({ name: 'mail', params: { folder } })
}

const initialMails: Mail[] = [
  {
    id: 1,
    from: 'john@example.com',
    fromName: 'John Doe',
    to: 'me@example.com',
    subject: 'Project Update',
    date: '2025-03-13',
    time: '10:15 AM',
    content: 'Here is the latest project update...',
    attachments: [
      { name: 'project_report.pdf', size: '1.2MB' },
      { name: 'timeline.xlsx', size: '450KB' }
    ],
    important: true,
    read: false,
    starred: true
  },
  {
    id: 2,
    from: 'jane@example.com',
    fromName: 'Jane Smith',
    to: 'me@example.com',
    subject: 'Meeting Reminder',
    date: '2025-03-12',
    time: '03:45 PM',
    content: 'Don\'t forget our meeting tomorrow at 10 AM.',
    important: false,
    read: true,
    starred: false
  },
  {
    id: 3,
    from: 'support@example.com',
    fromName: 'Support Team',
    to: 'me@example.com',
    subject: 'Your Ticket #12345',
    date: '2025-03-11',
    time: '09:30 AM',
    content: 'We\'ve received your support request and are working on it...',
    important: false,
    read: false,
    starred: false
  },
  {
    id: 4,
    from: 'newsletter@example.com',
    fromName: 'Example Newsletter',
    to: 'me@example.com',
    subject: 'Weekly Digest',
    date: '2025-03-10',
    time: '07:00 AM',
    content: 'Here\'s what\'s new this week...',
    important: false,
    read: false,
    starred: false
  }
]

const {
  mails,
  searchQuery,
  currentFolder,
  sortOption,
  currentPage,
  itemsPerPage,
  filteredMails,
  paginatedMails,
  toggleStarred,
  toggleImportant,
  toggleRead,
  deleteMail
} = useMailList(initialMails)

const {
  showComposeModal,
  newMail,
  handleAttachments,
  sendMail,
  replyMail
} = useMailCompose()

const selectedMail = ref<Mail | null>(null)

const forwardMail = (mail: Mail) => {
  newMail.value = {
    to: '',
    subject: `Fwd: ${mail.subject}`,
    content: `\n\n---------- Forwarded message ----------\nFrom: ${mail.fromName} <${mail.from}>\nDate: ${mail.date} ${mail.time}\nSubject: ${mail.subject}\n\n${mail.content}`,
    attachments: []
  }
  showComposeModal.value = true
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
