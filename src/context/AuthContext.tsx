import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { oauthService } from '../services/oauth';
import { Agent } from '@atproto/api';

interface OAuthAuthState {
  isAuthenticated: boolean;
  agent: Agent | null;
  handle?: string;
  did?: string;
}

interface AuthContextType {
  authState: OAuthAuthState;
  login: (handle: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<OAuthAuthState>({
    isAuthenticated: false,
    agent: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize OAuth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const result = await oauthService.init();

        if (result.isAuthenticated && result.agent) {
          // Fetch user profile to get handle and DID
          try {
            const profile = await oauthService.getUserProfile();
            setAuthState({
              isAuthenticated: true,
              agent: result.agent,
              handle: profile.handle,
              did: profile.did,
            });
          } catch (error) {
            console.error('Failed to fetch profile:', error);
            setAuthState({
              isAuthenticated: true,
              agent: result.agent,
            });
          }
        }
      } catch (error) {
        console.error('Failed to initialize OAuth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (handle: string) => {
    await oauthService.login(handle);
  };

  const logout = async () => {
    await oauthService.logout();
    setAuthState({
      isAuthenticated: false,
      agent: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
