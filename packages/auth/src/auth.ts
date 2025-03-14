import { login, logout } from './user';
import { createSession, deleteSession } from './session';
import { generateToken } from './token';

export const authenticate = async (username: string, password: string): Promise<string | null> => {
  const isValid = await login(username, password);
  if (!isValid) return null;

  const sessionId = await createSession(username);
  const token = await generateToken(username);

  return token;
};

export const deauthenticate = async (token: string): Promise<void> => {
  await logout();
  await deleteSession(token);
};
