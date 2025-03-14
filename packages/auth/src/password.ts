import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const changePassword = async (userId: string, oldPassword: string, newPassword: string): Promise<boolean> => {
  const user = users.find(u => u.id === userId);
  if (!user || !(await bcrypt.compare(oldPassword, user.password))) return false;
  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  return true;
};

export const resetPassword = async (email: string): Promise<boolean> => {
  const user = users.find(u => u.email === email);
  if (!user) return false;
  const tempPassword = Math.random().toString(36).slice(-8);
  user.password = await bcrypt.hash(tempPassword, SALT_ROUNDS);
  // TODO: Send email with tempPassword
  return true;
};
