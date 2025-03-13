import { ref } from 'vue'
import type { Mail, NewMail } from '@/types/mail'

export function useMailCompose() {
  const showComposeModal = ref(false)
  const newMail = ref<NewMail>({
    to: '',
    subject: '',
    content: '',
    attachments: []
  })

  const handleAttachments = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
      const attachments = Array.from(input.files).map(file => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)}KB`
      }))
      newMail.value.attachments = attachments
    }
  }

  const sendMail = (mails: Mail[]) => {
    const mail: Mail = {
      id: mails.length + 1,
      from: 'me@example.com',
      fromName: 'Me',
      to: newMail.value.to,
      subject: newMail.value.subject,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: newMail.value.content,
      attachments: newMail.value.attachments,
      important: false,
      read: true,
      starred: false
    }
    mails.unshift(mail)
    showComposeModal.value = false
    newMail.value = { to: '', subject: '', content: '', attachments: [] }
  }

  const replyMail = (mail: Mail) => {
    newMail.value = {
      to: mail.from,
      subject: `Re: ${mail.subject}`,
      content: `\n\nOn ${mail.date} ${mail.time}, ${mail.fromName} wrote:\n${mail.content}`,
      attachments: []
    }
    showComposeModal.value = true
  }

  return {
    showComposeModal,
    newMail,
    handleAttachments,
    sendMail,
    replyMail
  }
}
