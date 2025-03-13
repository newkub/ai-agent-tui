import { z } from 'zod';

const attachmentSchema = z.object({
  filename: z.string(),
  content: z.union([z.string(), z.instanceof(Buffer)]),
  contentType: z.string().optional(),
  encoding: z.string().optional()
});

const transportSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.number().min(1).max(65535),
  secure: z.boolean(),
  auth: z.object({
    user: z.string().min(1, 'Username is required'),
    pass: z.string().min(1, 'Password is required')
  }),
  pool: z.object({
    maxConnections: z.number().min(1).default(5),
    minConnections: z.number().min(1).default(1),
    connectionTimeout: z.number().min(1000).default(30000)
  }).optional()
});

const defaultsSchema = z.object({
  from: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  rateLimit: z.object({
    maxEmails: z.number().min(1).default(100),
    perMinutes: z.number().min(1).default(1)
  }).optional()
});

export const mailConfigSchema = z.object({
  transport: transportSchema,
  defaults: defaultsSchema
});

export type MailConfig = z.infer<typeof mailConfigSchema>;
export type TransportConfig = z.infer<typeof transportSchema>;
export type DefaultsConfig = z.infer<typeof defaultsSchema>;
export type Attachment = z.infer<typeof attachmentSchema>;

export function defineConfig<T extends MailConfig>(config: T): T {
  const result = mailConfigSchema.safeParse(config);
  if (!result.success) {
    console.warn('Configuration warnings:', result.error.format());
  }
  return result.data as T;
}