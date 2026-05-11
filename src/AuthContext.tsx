// src/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, signOut, sendPasswordResetEmail,
  onAuthStateChanged, updateProfile, type User,
} from 'firebase/auth';
import { auth, googleProvider, userService, type UserProfile } from './firebase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (u: User) => {
    let p = await userService.get(u.uid);
    if (!p) {
      await userService.create(u.uid, { name: u.displayName || '', email: u.email || '', phone: '' });
      p = await userService.get(u.uid);
    }
    setProfile(p);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u);
      if (u) await loadProfile(u);
      else setProfile(null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await loadProfile(cred.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await userService.create(cred.user.uid, { name, email, phone: '' });
    await loadProfile(cred.user);
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await loadProfile(cred.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null); setProfile(null);
  };

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  const refreshProfile = async () => {
    if (user) await loadProfile(user);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, loginWithGoogle, logout, resetPassword, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
