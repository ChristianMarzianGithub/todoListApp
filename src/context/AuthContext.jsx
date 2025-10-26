import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

const AuthContext = createContext();

const FREE_LIMITS = { lists: 20, items: 100 };
const PREMIUM_LIMITS = { lists: 10000, items: 10000 };

const GUEST_TEMPLATE = {
  id: 'guest',
  username: 'Guest',
  plan: 'free',
  isGuest: true,
  lists: [],
};

const USERS_KEY = 'tl-users';
const SESSION_KEY = 'tl-session';
const GUEST_KEY = 'tl-guest';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error('Failed to parse JSON from storage', error);
    return fallback;
  }
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => parseJson(localStorage.getItem(USERS_KEY), []));
  const [guestUser, setGuestUser] = useState(() => ({
    ...GUEST_TEMPLATE,
    ...parseJson(localStorage.getItem(GUEST_KEY), {}),
  }));
  const [currentUser, setCurrentUser] = useState(() => {
    const session = parseJson(localStorage.getItem(SESSION_KEY), null);
    if (!session) return null;
    if (session.type === 'guest') {
      const storedGuest = parseJson(localStorage.getItem(GUEST_KEY), {});
      return { ...GUEST_TEMPLATE, ...storedGuest };
    }
    if (session.type === 'user' && session.username) {
      const storedUsers = parseJson(localStorage.getItem(USERS_KEY), []);
      return storedUsers.find((u) => u.username === session.username) ?? null;
    }
    return null;
  });
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(GUEST_KEY, JSON.stringify({ ...guestUser, isGuest: true }));
  }, [guestUser]);

  useEffect(() => {
    if (!currentUser) {
      localStorage.removeItem(SESSION_KEY);
      return;
    }

    if (currentUser.isGuest) {
      setGuestUser((prev) => ({ ...prev, ...currentUser }));
      localStorage.setItem(SESSION_KEY, JSON.stringify({ type: 'guest' }));
    } else {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ type: 'user', username: currentUser.username })
      );
    }
  }, [currentUser]);

  const limits = useMemo(
    () => (currentUser?.plan === 'premium' ? PREMIUM_LIMITS : FREE_LIMITS),
    [currentUser]
  );

  const resetMessages = () => {
    setAuthError(null);
    setAuthSuccess(null);
  };

  const login = (username, password) => {
    resetMessages();
    const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (!user || user.password !== password) {
      setAuthError('Invalid username or password.');
      return false;
    }
    setCurrentUser(user);
    setAuthSuccess(`Welcome back, ${user.username}!`);
    return true;
  };

  const register = ({ username, password, plan }) => {
    resetMessages();
    const normalized = username.trim();
    if (!normalized) {
      setAuthError('Please provide a username.');
      return false;
    }
    if (users.some((u) => u.username.toLowerCase() === normalized.toLowerCase())) {
      setAuthError('That username is already taken.');
      return false;
    }
    const newUser = {
      id: uuid(),
      username: normalized,
      password,
      plan,
      isGuest: false,
      lists: [],
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setAuthSuccess('Account created! You are now signed in.');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthSuccess('You have been signed out.');
  };

  const startGuestSession = () => {
    resetMessages();
    const nextGuest = {
      ...GUEST_TEMPLATE,
      ...guestUser,
      username: guestUser.username || 'Guest',
    };
    setGuestUser(nextGuest);
    setCurrentUser({ ...nextGuest });
    setAuthSuccess('You are exploring the free version.');
  };

  const updateCurrentUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    if (updatedUser.isGuest) {
      setGuestUser(updatedUser);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    }
  };

  const upgradePlan = () => {
    if (!currentUser) return;
    if (currentUser.isGuest) {
      setAuthError('Create an account to unlock premium features.');
      return;
    }
    const updated = { ...currentUser, plan: 'premium' };
    updateCurrentUser(updated);
    setAuthSuccess('Thanks for upgrading to Premium!');
  };

  const downgradePlan = () => {
    if (!currentUser || currentUser.isGuest) return;
    const updated = { ...currentUser, plan: 'free' };
    updateCurrentUser(updated);
    setAuthSuccess('You have switched back to the free plan.');
  };

  const updateLists = (lists) => {
    if (!currentUser) return;
    const updated = { ...currentUser, lists };
    updateCurrentUser(updated);
  };

  const value = useMemo(
    () => ({
      user: currentUser,
      limits,
      login,
      register,
      logout,
      startGuestSession,
      upgradePlan,
      downgradePlan,
      updateLists,
      authError,
      authSuccess,
      resetMessages,
    }),
    [currentUser, limits, authError, authSuccess, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
