import { useState } from "react";
import { login as loginApi } from "../services/authApi";
import { useAuth } from "../store/useAuth";

export function useLogin(onSuccess?: () => void) {  // ← 추가
  const { login: setAuth } = useAuth();
  const [id,        setId]        = useState("");
  const [password,  setPassword]  = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);

  async function handleLogin() {
  console.log("1. handleLogin 호출됨", { id, password });
  if (!id || !password) {
    console.log("2. 비어있어서 return");
    return;
  }
  setLoading(true);
  setError(null);
  try {
    console.log("3. API 호출 시작");
    const tokens = await loginApi(id, password);
    console.log("4. API 성공", tokens);
    setAuth(tokens);
    console.log("5. setAuth 완료");
    onSuccess?.();
    console.log("6. onSuccess 완료");
  } catch (e) {
    console.log("7. 에러 발생", e);
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