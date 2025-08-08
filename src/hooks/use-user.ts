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
): [T, (value: F) => void, boolean] => {
  const [state, setState] = useState<T>(initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let value;
    try {
      value = localStorage.getItem(key);
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


  return [state, setStoredState, isInitialized];
};

export const useUser = () => {
  const [user, setUser, isInitialized] = useStore<User, User | null>('user', { username: null });

  const login = (username: string) => {
    setUser({ username });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const setProfile = (profileData: UserProfile) => {
    setUser({ ...user, profile: profileData });
  };

  const getProfile = useCallback(() => {
     if (!isInitialized) return null;
     return user.profile || null;
  }, [isInitialized, user.profile]);


  return { 
    user, 
    username: user?.username, 
    login, 
    logout, 
    setProfile, 
    getProfile, 
    isAuthenticated: !!user?.username, 
    isClient: isInitialized 
  };
};
