type Session = {
  token: string; // stores userId directly for demo persistence
  userId: string;
  createdAt: number;
};

// Demo: store userId directly in the cookie so it survives dev reloads/HMR.
export function createSession(userId: string): Session {
  const token = userId;
  return { token, userId, createdAt: Date.now() };
}

export function getSession(token: string | undefined | null): Session | undefined {
  if (!token) return undefined;
  return { token, userId: token, createdAt: Date.now() };
}

export function deleteSession(_token: string | undefined | null) {
  // Cookie removal handled by caller; nothing to delete server-side in this demo.
}
