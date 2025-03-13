interface Email {
  id: string
  sender: string
  subject: string
  preview: string
  body: string
  date: string
  read: boolean
}

const emails: Email[] = [
  {
    id: '1',
    sender: 'support@example.com',
    subject: 'Welcome to our service!',
    preview: 'Thank you for joining...',
    body: 'Thank you for joining our service...',
    date: '2025-03-13',
    read: false
  }
]

const port = 3000

async function startServer(port: number) {
  try {
    const server = Bun.serve({
      port,
      async fetch(req) {
        const url = new URL(req.url)

        // API routes
        if (url.pathname === '/api/emails' && req.method === 'GET') {
          return new Response(JSON.stringify(emails))
        }

        if (url.pathname === '/api/emails' && req.method === 'POST') {
          const formData = await req.formData()
          const newEmail: Email = {
            id: String(emails.length + 1),
            sender: 'me@example.com',
            subject: String(formData.get('subject')),
            preview: String(formData.get('body')).slice(0, 50),
            body: String(formData.get('body')),
            date: new Date().toISOString(),
            read: false
          }
          emails.unshift(newEmail)
          return new Response(JSON.stringify(newEmail))
        }

        if (url.pathname.startsWith('/api/emails/') && url.pathname.endsWith('/read') && req.method === 'PATCH') {
          const id = url.pathname.split('/')[3]
          const email = emails.find(e => e.id === id)
          if (email) email.read = true
          return new Response(JSON.stringify(email))
        }

        if (url.pathname.startsWith('/api/emails/') && req.method === 'DELETE') {
          const id = url.pathname.split('/')[3]
          const index = emails.findIndex(e => e.id === id)
          if (index !== -1) emails.splice(index, 1)
          return new Response(null, { status: 204 })
        }

        // Serve static files
        const filePath = url.pathname === '/' ? '/index.html' : url.pathname
        const file = Bun.file(`./dist${filePath}`)
        if (await file.exists()) {
          return new Response(file)
        }

        return new Response('Not found', { status: 404 })
      }
    })

    console.log(`Server running at http://localhost:${port}`)
    return server
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`)
      return startServer(port + 1)
    }
    throw err
  }
}

startServer(port)
