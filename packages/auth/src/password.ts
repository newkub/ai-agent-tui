import type { PasswordConfig } from './config';
import { users } from './user';

export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = users.find(u => u.id === userId);
  if (!user || !(await Bun.password.verify(oldPassword, user.password))) return false;
  user.password = await Bun.password.hash(newPassword);
  return true;
};

export const resetPassword = async (email: string) => {
  const user = users.find(u => u.email === email);
  if (!user) return false;
  user.password = await Bun.password.hash(Math.random().toString(36).slice(-8));
  return true;
};

export const validatePassword = (password: string, config: PasswordConfig) => 
  password.length >= config.minLength &&
  (!config.requireLowercase || /[a-z]/.test(password)) &&
  (!config.requireUppercase || /[A-Z]/.test(password)) &&
  (!config.requireNumbers || /[0-9]/.test(password)) &&
  (!config.requireSpecialChars || /[^a-zA-Z0-9]/.test(password));
