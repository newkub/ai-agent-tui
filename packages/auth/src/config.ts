interface SessionConfig {
  expiresIn: string;
  refreshTokenExpiresIn: string;
  cookieName: string;
  secure: boolean;
}

interface JwtConfig {
  secret: string;
  algorithm: string;
}

interface PasswordConfig {
  saltRounds: number;
  minLength: number;
  requireLowercase: boolean;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

interface OAuthProviderConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

interface SecurityConfig {
  enable2FA: boolean;
  rateLimit: {
    maxAttempts: number;
    windowMs: number;
  };
}

export interface AuthConfig {
  session: SessionConfig;
  jwt: JwtConfig;
  password: PasswordConfig;
  oauth: {
    providers: Record<string, OAuthProviderConfig>;
  };
  security: SecurityConfig;
}

export function defineConfig(config: AuthConfig): AuthConfig {
  return config;
}
