import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const SESSION_KEY = "couchpotato-admin-session";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  useSupabaseAuth: boolean;
  loginWithPassword: (password: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const envPassword =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ||
  "couchpotato-admin";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const useSupabaseAuth = isSupabaseConfigured;

  useEffect(() => {
    const init = async () => {
      if (useSupabaseAuth && supabase) {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } else {
        setIsAuthenticated(sessionStorage.getItem(SESSION_KEY) === "1");
      }
      setLoading(false);
    };
    init();

    if (useSupabaseAuth && supabase) {
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        setIsAuthenticated(!!session);
      });
      return () => sub.subscription.unsubscribe();
    }
  }, [useSupabaseAuth]);

  const loginWithPassword = useCallback(async (password: string) => {
    if (useSupabaseAuth) return false;
    if (password === envPassword) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, [useSupabaseAuth]);

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return "Supabase가 설정되지 않았습니다.";
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return error.message;
      setIsAuthenticated(true);
      return null;
    },
    []
  );

  const logout = useCallback(async () => {
    sessionStorage.removeItem(SESSION_KEY);
    if (supabase) await supabase.auth.signOut();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      loading,
      useSupabaseAuth,
      loginWithPassword,
      loginWithEmail,
      logout,
    }),
    [
      isAuthenticated,
      loading,
      useSupabaseAuth,
      loginWithPassword,
      loginWithEmail,
      logout,
    ]
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
