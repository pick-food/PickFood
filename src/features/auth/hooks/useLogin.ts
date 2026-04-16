import { useState } from "react";

export function useLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);

  function handleLogin() {
    // TODO: 백엔드 연동
    console.log({ id, password, autoLogin });
  }

  return {
    id,
    setId,
    password,
    setPassword,
    autoLogin,
    setAutoLogin,
    handleLogin,
  };
}