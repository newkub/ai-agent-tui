import { ref } from 'vue'

export interface NewEmail {
  to: string
  subject: string
  body: string
  attachments: File[]
}

export default function useMailClient() {
  interface Email {
    id: string
    sender: string
    subject: string
    preview: string
    body: string
    date: string
    read: boolean
    important: boolean
    attachments?: { name: string; url: string }[]
  }

  const emails = ref<Email[]>([])
  const selectedEmail = ref<Email | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchEmails() {
    try {
      isLoading.value = true
      error.value = null
      const response = await fetch('http://localhost:3000/api/emails')
      if (!response.ok) throw new Error('Failed to fetch emails')
      emails.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch emails'
    } finally {
      isLoading.value = false
    }
  }

  const markAsRead = async (id: string) => {
    try {
      isLoading.value = true
      // TODO: Implement mark as read API call
      const index = emails.value.findIndex(email => email.id === id)
      if (index !== -1) {
        emails.value[index].read = true
      }
    } catch (err) {
      error.value = 'Failed to mark email as read'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const deleteEmail = async (id: string) => {
    try {
      isLoading.value = true
      // TODO: Implement delete email API call
      emails.value = emails.value.filter(email => email.id !== id)
      if (selectedEmail.value?.id === id) {
        selectedEmail.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete email'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const sendEmail = async (email: NewEmail) => {
    try {
      isLoading.value = true
      // TODO: Implement send email API call
      // Add sent email to emails list
      emails.value.unshift({
        id: Date.now().toString(),
        sender: 'me',
        subject: email.subject,
        body: email.body,
        date: new Date().toISOString(),
        read: true,
        important: false,
        preview: email.body.substring(0, 100),
        attachments: []
      })
    } catch (err) {
      error.value = 'Failed to send email'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function replyToEmail(email: Email, replyBody: string) {
    try {
      await sendEmail({
        to: email.sender,
        subject: `Re: ${email.subject}`,
        body: replyBody,
        attachments: []
      })
    } catch (err) {
      console.error('Failed to reply to email:', err)
      throw err
    }
  }

  async function forwardEmail(email: Email, forwardTo: string) {
    try {
      await sendEmail({
        to: forwardTo,
        subject: `Fwd: ${email.subject}`,
        body: email.body,
        attachments: []
      })
    } catch (err) {
      console.error('Failed to forward email:', err)
      throw err
    }
  }

  async function archiveEmail(emailId: string) {
    try {
      const email = emails.value.find(e => e.id === emailId)
      if (email) {
        email.important = false
        await fetch(`http://localhost:3000/api/emails/${emailId}/archive`, {
          method: 'PATCH'
        })
      }
    } catch (err) {
      console.error('Failed to archive email:', err)
    }
  }

  return {
    emails,
    selectedEmail,
    isLoading,
    error,
    fetchEmails,
    markAsRead,
    deleteEmail,
    sendEmail,
    replyToEmail,
    forwardEmail,
    archiveEmail
  }
}
