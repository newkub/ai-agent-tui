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
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: providers.google.clientId,
      client_secret: providers.google.clientSecret,
      redirect_uri: providers.google.redirectUri,
      grant_type: 'authorization_code'
    })
  });
  const data = await response.json();
  return { token: data.access_token };
};
