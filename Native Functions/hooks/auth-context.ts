import { supabase } from '@/lib/supabase';
import { createContext, useContext, useState } from 'react'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  setIsLoggedIn(true);
};

  const logout = async () => {
  await supabase.auth.signOut();
  setIsLoggedIn(false);
};
}

export type AuthData = {
  claims?: Record<string, any> | null
  profile?: any | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthData>({
  claims: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
})

export const useAuthContext = () => useContext(AuthContext)