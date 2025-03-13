import net from 'net';
import type { MailConfig, TransportConfig } from './config';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class Mailer {
  private config: TransportConfig;
  private defaults: MailConfig['defaults'];

  constructor(config: MailConfig) {
    this.config = config.transport;
    this.defaults = config.defaults;
  }

  private async sendCommand(socket: net.Socket, command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      socket.write(command + '\r\n');
      socket.once('data', (data) => {
        const response = data.toString();
        if (response.startsWith('2') || response.startsWith('3')) {
          resolve(response);
        } else {
          reject(new Error(`SMTP Error: ${response}`));
        }
      });
    });
  }

  private async connect(): Promise<net.Socket> {
    const socket = net.createConnection(this.config.port, this.config.host);
    await this.sendCommand(socket, 'EHLO localhost');
    if (this.config.secure) {
      await this.sendCommand(socket, 'STARTTLS');
    }
    if (this.config.auth) {
      await this.sendCommand(socket, 'AUTH LOGIN');
      await this.sendCommand(socket, Buffer.from(this.config.auth.user).toString('base64'));
      await this.sendCommand(socket, Buffer.from(this.config.auth.pass).toString('base64'));
    }
    return socket;
  }

  async sendMail(options: EmailOptions) {
    const socket = await this.connect();
    try {
      await this.sendCommand(socket, `MAIL FROM:<${this.defaults.from}>`);
      await this.sendCommand(socket, `RCPT TO:<${options.to}>`);
      await this.sendCommand(socket, 'DATA');
      const emailContent = [
        `From: ${this.defaults.from}`,
        `To: ${options.to}`,
        `Subject: ${options.subject || this.defaults.subject}`,
        '',
        options.text || options.html || '',
        '.'
      ].join('\r\n');
      await this.sendCommand(socket, emailContent);
    } finally {
      socket.end();
    }
  }
}

export function createMailer(config: MailConfig) {
  return new Mailer(config);
}