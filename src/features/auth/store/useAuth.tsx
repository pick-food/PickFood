import { useState, useEffect, useCallback, createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../services/authApi";
import { getMyProfile, logout as logoutApi } from "../services/authApi";
import { getLocalDisplayName } from "../utils/displayName";

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  accessToken: string | null;
}

interface AuthContextValue extends AuthState {
  login:  (tokens: { access_token: string; refresh_token: string; user: AuthUser }) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem("access_token");
    return {
      isLoggedIn:  !!token,
      user:        null,
      accessToken: token,
    };
  });

  // 페이지 새로고침 시 토큰이 있으면 /auth/me 로 사용자 정보 복원
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    getMyProfile()
      .then(profile => {
        setState(s => ({
          ...s,
          user: {
            id:         profile.id,
            email:      profile.email,
            name:       getLocalDisplayName(profile.id) ?? profile.name,
            nickname:   profile.nickname,
            role:       profile.role,
            created_at: profile.created_at,
          },
        }));
      })
      .catch(() => {
        // 토큰 만료 또는 유효하지 않음 — 로컬 상태 초기화
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setState({ isLoggedIn: false, user: null, accessToken: null });
      });
  }, []);

  const login = useCallback(
    (tokens: { access_token: string; refresh_token: string; user: AuthUser }) => {
      localStorage.setItem("access_token",  tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
      const localName = getLocalDisplayName(tokens.user.id);
      const user = localName ? { ...tokens.user, name: localName } : tokens.user;
      setState({ isLoggedIn: true, user, accessToken: tokens.access_token });
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi(); // POST /auth/logout + localStorage 정리
    } catch {
      // API 실패해도 로컬 상태는 반드시 초기화
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
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
