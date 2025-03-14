interface User {
  username: string;
  password: string;
}

const users: User[] = [];

export const login = async (username: string, password: string): Promise<boolean> => {
  const user = users.find(u => u.username === username);
  return user?.password === password;
};

export const logout = async (): Promise<void> => {
  // Clear session or token here
};

export const register = async (userData: { username: string; password: string }): Promise<boolean> => {
  if (users.some(u => u.username === userData.username)) return false;
  users.push(userData);
  return true;
};
