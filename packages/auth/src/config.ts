export interface SessionConfig {
  expiresIn: string;
  refreshTokenExpiresIn: string;
  cookieName: string;
  secure: boolean;
}

export interface JwtConfig {
  secret: string;
  algorithm: string;
}

export interface PasswordConfig {
  saltRounds: number;
  minLength: number;
  requireLowercase?: boolean;
  requireUppercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

export interface OAuthProviderConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

export interface SecurityConfig {
  enable2FA?: boolean;
  rateLimit?: {
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
  security?: SecurityConfig;
}

export function defineConfig<T extends AuthConfig>(config: T): T {
  return config;
}
