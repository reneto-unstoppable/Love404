
'use client';

import { useState, useEffect, useCallback } from 'react';

type Profile = {
  name: string;
  age: number;
  bio: string;
  image: string;
  spiritVegetable: string;
  loveLanguage: 'Sarcasm' | 'Ghosting';
}

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
  likedProfiles?: Profile[];
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
  const [user, setUser, isInitialized] = useStore<User, User | null>('user', { username: null, likedProfiles: [] });

  const login = (username: string) => {
    setUser({ username, likedProfiles: [] });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const setProfile = (profileData: UserProfile) => {
    setUser({ ...user, profile: profileData });
  };

  const addLikedProfile = (profile: Profile) => {
    const currentLiked = user?.likedProfiles || [];
    if (!currentLiked.find(p => p.name === profile.name)) {
      setUser({ ...user, likedProfiles: [...currentLiked, profile] });
    }
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
    addLikedProfile,
    getProfile, 
    isAuthenticated: !!user?.username, 
    isClient: isInitialized 
  };
};

