'use client';

import { useState, useEffect, useCallback } from 'react';

type User = {
  username: string | null;
};

const useStore = <T, F>(
  key: string,
  initialState: T | (() => T)
): [T, (value: F) => void] => {
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        setState(JSON.parse(value));
      }
    } catch (error) {
      console.error(error);
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

  return [state, setStoredState];
};

export const useUser = () => {
  const [user, setUser] = useStore<User, User | null>('user', { username: null });

  const login = (username: string) => {
    setUser({ username });
  };

  const logout = () => {
    setUser(null);
  };
  
  const setProfile = (profileData: any) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, profile: profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  const getProfile = () => {
     if (typeof window === 'undefined') return null;
     const storedUser = localStorage.getItem('user');
     return storedUser ? JSON.parse(storedUser)?.profile : null;
  }


  return { user, username: user?.username, login, logout, setProfile, getProfile, isAuthenticated: !!user?.username };
};
