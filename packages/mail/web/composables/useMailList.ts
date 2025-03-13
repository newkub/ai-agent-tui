import { computed, ref } from 'vue'
import type { Mail } from '@/types/mail'

export function useMailList(initialMails: Mail[]) {
  const mails = ref(initialMails)
  const searchQuery = ref('')
  const currentFolder = ref('inbox')
  const sortOption = ref('date-desc')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  const filteredMails = computed(() => {
    const filtered = mails.value.filter(mail => {
      const matchesFolder = currentFolder.value === 'inbox' || 
        (currentFolder.value === 'starred' ? mail.starred :
         currentFolder.value === 'important' ? mail.important :
         currentFolder.value === 'unread' ? !mail.read : true)
      const matchesSearch = `${mail.subject} ${mail.from} ${mail.content}`.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchesFolder && matchesSearch
    })

    if (sortOption.value === 'date-desc') {
      filtered.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`).getTime()
        const dateB = new Date(`${b.date} ${b.time}`).getTime()
        return dateB - dateA
      })
    } else if (sortOption.value === 'date-asc') {
      filtered.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`).getTime()
        const dateB = new Date(`${b.date} ${b.time}`).getTime()
        return dateA - dateB
      })
    } else if (sortOption.value === 'subject') {
      filtered.sort((a, b) => a.subject.localeCompare(b.subject))
    }

    return filtered
  })

  const paginatedMails = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredMails.value.slice(start, end)
  })

  const toggleStarred = (mail: Mail) => {
    mail.starred = !mail.starred
  }

  const toggleImportant = (mail: Mail) => {
    mail.important = !mail.important
  }

  const toggleRead = (mail: Mail) => {
    mail.read = !mail.read
  }

  const deleteMail = (mail: Mail) => {
    const index = mails.value.findIndex(m => m.id === mail.id)
    if (index !== -1) {
      mails.value.splice(index, 1)
    }
  }

  return {
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
  }
}
