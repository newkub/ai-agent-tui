import type { Message } from '../types/providers';

export const mapMessages = (messages: Message[]): string => {
  return messages
    .filter(msg => msg.role !== 'system')
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');
};
