'use client';

import { useState, useEffect, useCallback } from 'react';

type UserProfile = {
  displayName?: string;
  emotionalAge?: number[];
  conspiracyTheory?: string;
  spiritVegetable?: string;
  loveLanguage?: 'Sarcasm' | 'Ghosting';
  loveAtFirstSite?: boolean;
  profilePic?: string | null;
}

type User = {
  username: string | null;
  profile?: UserProfile;
};

const useStore = <T, F>(
  key: string,
  initialState: T | (() => T)
): [T, (value: F) => void] => {
  const [state, setState] = useState<T>(initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        setState(JSON.parse(value));
      }
    } catch (error) {
      console.error(error);
    } finally {
        setIsInitialized(true);
    }
  }, [key]);

  const setStoredState = useCallback((value: F) => {
    try {
      const newState = typeof value === 'function' ? value(state) : value;
      localStorage.setItem(key, JSON.stringify(newState));
      setState(newState);
    } catch (error) {
      console.error(error);
    }
  }, [key, state]);

  // Return initial state until the component is initialized
  if (!isInitialized) {
      const s = typeof initialState === 'function' ? (initialState as () => T)() : initialState;
      // We can't return the setter, as it would be stale
      const dummySetter = () => {};
      return [s, dummySetter as (value: F) => void];
  }


  return [state, setStoredState];
};

export const useUser = () => {
  const [user, setUser] = useStore<User, User | null>('user', { username: null });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const login = (username: string) => {
    setUser({ username });
  };

  const logout = () => {
    setUser(null);
    // also remove profile from localstorage
    localStorage.removeItem('user');
  };
  
  const setProfile = (profileData: UserProfile) => {
    setUser({ ...user, profile: profileData });
  }

  const getProfile = useCallback(() => {
     if (!isClient) return null;
     return user.profile || null;
  }, [isClient, user.profile]);


  return { user, username: user?.username, login, logout, setProfile, getProfile, isAuthenticated: !!user?.username, isClient };
};
