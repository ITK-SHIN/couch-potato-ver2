import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  canUseLocalPasswordAuth,
  isProductionWithoutSupabase,
} from "../lib/adminAuthPolicy";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const SESSION_KEY = "couchpotato-admin-session";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  useSupabaseAuth: boolean;
  /** 프로덕션인데 Supabase 미연결 — 로그인 불가 */
  authBlocked: boolean;
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
  const authBlocked = isProductionWithoutSupabase();

  useEffect(() => {
    const init = async () => {
      if (authBlocked) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
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
  }, [useSupabaseAuth, authBlocked]);

  const loginWithPassword = useCallback(
    async (password: string) => {
      if (authBlocked || !canUseLocalPasswordAuth()) return false;
      if (password === envPassword) {
        sessionStorage.setItem(SESSION_KEY, "1");
        setIsAuthenticated(true);
        return true;
      }
      return false;
    },
    [authBlocked]
  );

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      if (authBlocked) {
        return "프로덕션 환경에서는 Supabase 연결이 필요합니다.";
      }
      if (!supabase) return "Supabase가 설정되지 않았습니다.";
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return error.message;
      setIsAuthenticated(true);
      return null;
    },
    [authBlocked]
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
      authBlocked,
      loginWithPassword,
      loginWithEmail,
      logout,
    }),
    [
      isAuthenticated,
      loading,
      useSupabaseAuth,
      authBlocked,
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
