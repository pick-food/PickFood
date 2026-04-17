import { useState } from "react";
import { forgotPassword as forgotPasswordApi } from "../services/authApi";

type EmailVerifyStatus = "idle" | "sent";
export type FindPasswordResult = "idle" | "notFound" | "found";

export function useFindPassword() {
  const [email,       setEmail]       = useState("");
  const [emailStatus, setEmailStatus] = useState<EmailVerifyStatus>("idle");
  const [result,      setResult]      = useState<FindPasswordResult>("idle");
  const [error,       setError]       = useState<string | null>(null);
  const [loading,     setLoading]     = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit() {
    if (!emailValid) return;
    setLoading(true);
    setError(null);
    try {
      const ok = await forgotPasswordApi(email);
      setResult(ok ? "found" : "notFound");
    } catch {
      setResult("notFound");
      setError("일치하는 계정을 찾을 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult("idle");
    setEmail("");
    setEmailStatus("idle");
    setError(null);
  }

  return {
    email, setEmail, emailValid,
    emailStatus, setEmailStatus,
    result, error, loading,
    handleSubmit, reset,
  };
}