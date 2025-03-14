interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

const providers: Record<string, OAuthConfig> = {
  google: {
    clientId: 'your-google-client-id',
    clientSecret: 'your-google-client-secret',
    redirectUri: 'http://localhost:3000/auth/google/callback'
  }
};

export const oauthLogin = async (provider: string): Promise<string> => {
  const config = providers[provider];
  if (!config) throw new Error('Unsupported provider');
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code&scope=email profile`;
};

export const oauthCallback = async (code: string): Promise<{ token: string }> => {
  // TODO: Exchange code for token
  return { token: 'oauth-token' };
};
