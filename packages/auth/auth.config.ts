import { defineConfig, type AuthConfig } from './src/config';

export default defineConfig({
  session: {
    expiresIn: '7d',
    refreshTokenExpiresIn: '30d',
    cookieName: 'auth_session',
    secure: process.env.NODE_ENV === 'production'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    algorithm: 'HS256'
  },
  password: {
    saltRounds: 10,
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  oauth: {
    providers: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackUrl: '/auth/oauth/google/callback'
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackUrl: '/auth/oauth/github/callback'
      }
    }
  },
  security: {
    enable2FA: true,
    rateLimit: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000
    }
  }
} satisfies AuthConfig);
