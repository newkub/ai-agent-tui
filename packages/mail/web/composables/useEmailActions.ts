import { ref } from 'vue'

export interface Email {
  id: number
  from: string
  fromName: string
  to: string
  subject: string
  date: string
  time: string
  content: string
  body: string
  sender: string
  preview: string
  attachments?: { name: string; size: string }[]
  important: boolean
  read: boolean
  starred: boolean
}

interface NewEmail {
  to: string
  subject: string
  body: string
  attachments: File[]
}

export function useEmailActions() {
  const selectedEmail = ref<Email | null>(null)

  const markAsRead = (id: string) => {
    const email = selectedEmail.value
    if (email && email.id.toString() === id) {
      email.read = true
    }
  }

  const deleteEmail = (id: string) => {
    if (selectedEmail.value && selectedEmail.value.id.toString() === id) {
      selectedEmail.value = null
    }
  }

  const sendEmail = async (email: NewEmail) => {
    try {
      const response = await fetch('http://localhost:3000/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(email)
      })
      
      if (!response.ok) {
        throw new Error('Failed to send email')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }

  const replyToEmail = (email: Email) => {
    return {
      to: email.from,
      subject: `Re: ${email.subject}`,
      body: `\n\n-------- Original Message --------\nFrom: ${email.fromName} <${email.from}>\nDate: ${email.date} ${email.time}\nSubject: ${email.subject}\n\n${email.body || email.content}`,
      attachments: []
    } as NewEmail
  }

  const forwardEmail = (email: Email) => {
    return {
      to: '',
      subject: `Fwd: ${email.subject}`,
      body: `\n\n-------- Forwarded Message --------\nFrom: ${email.fromName} <${email.from}>\nDate: ${email.date} ${email.time}\nSubject: ${email.subject}\n\n${email.body || email.content}`,
      attachments: []
    } as NewEmail
  }

  const archiveEmail = (id: string) => {
    try {
      const email = selectedEmail.value
      if (email && email.id.toString() === id) {
        email.important = false
        fetch(`http://localhost:3000/api/emails/${id}/archive`, {
          method: 'PATCH'
        })
      }
    } catch (err) {
      console.error('Failed to archive email:', err)
    }
  }

  return {
    selectedEmail,
    markAsRead,
    deleteEmail,
    sendEmail,
    replyToEmail,
    forwardEmail,
    archiveEmail
  }
}
