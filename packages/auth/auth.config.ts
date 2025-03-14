import { defineConfig, type AuthConfig } from './src/config';

export default defineConfig({
  oauth: {
    providers: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackUrl: process.env.GITHUB_CALLBACK_URL || '',
      },
      facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID || '',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
        callbackUrl: process.env.FACEBOOK_CALLBACK_URL || '',
      },
      twitter: {
        clientId: process.env.TWITTER_CLIENT_ID || '',
        clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
        callbackUrl: process.env.TWITTER_CALLBACK_URL || '',
      },
      linkedin: {
        clientId: process.env.LINKEDIN_CLIENT_ID || '',
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
        callbackUrl: process.env.LINKEDIN_CALLBACK_URL || '',
      },
      apple: {
        clientId: process.env.APPLE_CLIENT_ID || '',
        clientSecret: process.env.APPLE_CLIENT_SECRET || '',
        callbackUrl: process.env.APPLE_CALLBACK_URL || '',
      },
      microsoft: {
        clientId: process.env.MICROSOFT_CLIENT_ID || '',
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
        callbackUrl: process.env.MICROSOFT_CALLBACK_URL || '',
      },
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID || '',
        clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
        callbackUrl: process.env.DISCORD_CALLBACK_URL || '',
      },
    },
  },
  password: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    saltRounds: 10,
  },
  session: {
    secure: true,
    maxAge: 3600,
    expiresIn: '',
    refreshTokenExpiresIn: '',
    cookieName: ''
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-jwt-secret',
    ttl: '1h',
    algorithm: ''
  },
  security: {
    enable2FA: true,
  },
} satisfies AuthConfig);
