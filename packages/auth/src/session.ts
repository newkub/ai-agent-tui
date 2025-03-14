interface Session {
  id: string;
  userId: string;
  createdAt: number;
}

const sessions: Session[] = [];

export const createSession = async (userId: string): Promise<string> => {
  const sessionId = crypto.randomUUID();
  sessions.push({
    id: sessionId,
    userId,
    createdAt: Date.now()
  });
  return sessionId;
};

export const getSession = async (sessionId: string): Promise<Session | null> => {
  return sessions.find(s => s.id === sessionId) || null;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  const index = sessions.findIndex(s => s.id === sessionId);
  if (index !== -1) {
    sessions.splice(index, 1);
  }
};
