import { useState } from "react";
import { login as loginApi } from "../services/authApi";
import { useAuth } from "../store/useAuth";

export function useLogin() {
  const { login: setAuth } = useAuth();
  const [id,        setId]        = useState("");
  const [password,  setPassword]  = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);

  async function handleLogin() {
    if (!id || !password) return;
    setLoading(true);
    setError(null);
    try {
      const tokens = await loginApi(id, password);
      setAuth(tokens);
    } catch {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  }

  return {
    id, setId,
    password, setPassword,
    autoLogin, setAutoLogin,
    error, loading,
    handleLogin,
  };
}