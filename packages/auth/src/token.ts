import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key';
const TOKEN_EXPIRATION = '1h';

export const generateToken = async (userId: string): Promise<string> => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    jwt.verify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
};

export const refreshToken = async (oldToken: string): Promise<string> => {
  const decoded = jwt.verify(oldToken, SECRET_KEY) as { userId: string };
  return generateToken(decoded.userId);
};
