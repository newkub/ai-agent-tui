import { defineConfig } from './src/config';

export default defineConfig({
  transport: {
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: ''
    }
  },
  defaults: {
    from: 'no-reply@example.com',
    subject: 'Default Subject'
  }
});
