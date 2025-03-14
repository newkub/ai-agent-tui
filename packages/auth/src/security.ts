import { authenticator } from 'otplib';

export const enable2FA = async (userId: string): Promise<string> => {
  const secret = authenticator.generateSecret();
  // Store secret in user's profile
  return authenticator.keyuri(userId, 'YourApp', secret);
};

export const verify2FA = async (userId: string, token: string): Promise<boolean> => {
  // Retrieve secret from user's profile
  const secret = 'user-secret'; // Replace with actual retrieval logic
  return authenticator.verify({ token, secret });
};
