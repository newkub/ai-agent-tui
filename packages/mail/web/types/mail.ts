export interface Mail {
  id: number
  from: string
  fromName: string
  to: string
  subject: string
  date: string
  time: string
  content: string
  attachments?: { name: string; size: string }[]
  important: boolean
  read: boolean
  starred: boolean
}

export interface NewMail {
  to: string
  subject: string
  content: string
  attachments: { name: string; size: string }[]
}
