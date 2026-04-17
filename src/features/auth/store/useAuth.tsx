import { useState, useCallback, createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../services/authApi";

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  accessToken: string | null;
}

interface AuthContextValue extends AuthState {
  login:  (tokens: { access_token: string; refresh_token: string; user: AuthUser }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    // 새로고침해도 로그인 유지
    const token = localStorage.getItem("access_token");
    return {
      isLoggedIn:  !!token,
      user:        null,
      accessToken: token,
    };
  });

  const login = useCallback(
    (tokens: { access_token: string; refresh_token: string; user: AuthUser }) => {
      localStorage.setItem("access_token",  tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
      setState({ isLoggedIn: true, user: tokens.user, accessToken: tokens.access_token });
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setState({ isLoggedIn: false, user: null, accessToken: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}