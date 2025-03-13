# Mail Package

A lightweight SMTP client implementation for sending emails.

## Features

- Custom SMTP client implementation
- Type-safe configuration using Zod
- Support for both plain text and HTML emails
- Secure connections (STARTTLS)
- Authentication support (LOGIN)

## Installation

```bash
bun add @cli/mail
```

## Usage

```typescript
import { createMailer } from '@cli/mail';
import mailConfig from './mail.config';

const mailer = createMailer(mailConfig);

await mailer.sendMail({
  to: 'recipient@example.com',
  subject: 'Hello World',
  text: 'This is a test email',
});
```

## Configuration

Create a `mail.config.ts` file:

```typescript
import { defineConfig } from '@cli/mail';

export default defineConfig({
  transport: {
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      user: 'your-username',
      pass: 'your-password'
    }
  },
  defaults: {
    from: 'no-reply@example.com',
    subject: 'Default Subject'
  }
});
```

## API Reference

### `createMailer(config: MailConfig): Mailer`

Creates a new mailer instance.

### `Mailer.sendMail(options: EmailOptions): Promise<void>`

Sends an email. Options:

- `to`: Recipient email address
- `subject`: Email subject
- `text`: Plain text content
- `html`: HTML content

## License

MIT