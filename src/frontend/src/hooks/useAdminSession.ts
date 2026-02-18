import { useState, useEffect } from 'react';
import { useActor } from './useActor';

interface AdminSession {
  token: string;
  expiresAt: number;
}

const STORAGE_KEY = 'admin_session';

function getStoredSession(): AdminSession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored) as AdminSession;
    // Check if expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function storeSession(token: string): void {
  // Session expires in 8 hours (matching backend)
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
  const session: AdminSession = { token, expiresAt };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function useAdminSession() {
  const { actor } = useActor();
  const [session, setSession] = useState<AdminSession | null>(getStoredSession);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sync session state with storage
  useEffect(() => {
    const stored = getStoredSession();
    setSession(stored);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    if (!actor) throw new Error('Actor not available');
    
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const token = await actor.login(username, password);
      storeSession(token);
      setSession({ token, expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
    } catch (error: any) {
      const errorMessage = error?.message || 'Login failed';
      setLoginError(errorMessage.includes('Unauthorized') ? 'Invalid credentials' : 'Login failed');
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (!session || !actor) {
      clearSession();
      setSession(null);
      return;
    }

    try {
      await actor.logout(session.token);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearSession();
      setSession(null);
    }
  };

  const isAuthenticated = !!session && Date.now() < session.expiresAt;
  const token = session?.token || null;

  return {
    isAuthenticated,
    token,
    login,
    logout,
    isLoggingIn,
    loginError,
  };
}
