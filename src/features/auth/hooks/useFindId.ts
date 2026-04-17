import { useState, useEffect, useRef } from "react";
import {
  sendFindIdCode as sendFindIdCodeApi,
  verifyFindIdCode as verifyFindIdCodeApi,
} from "../services/authApi";

type PhoneVerifyStatus = "idle" | "sent" | "verified";
export type FindIdResult = "idle" | "notFound" | "found";

export function useFindId() {
  const [name,        setName]        = useState("");
  const [phone,       setPhone]       = useState("");
  const [phoneCode,   setPhoneCode]   = useState("");
  const [phoneStatus, setPhoneStatus] = useState<PhoneVerifyStatus>("idle");
  const [result,      setResult]      = useState<FindIdResult>("idle");
  const [foundId,     setFoundId]     = useState("");
  const [error,       setError]       = useState<string | null>(null);
  const [loading,     setLoading]     = useState(false);

  // 5분 타이머
  const [timeLeft, setTimeLeft] = useState(300);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startTimer() {
    setTimeLeft(300);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const phoneValid = /^01[0-9]{8,9}$/.test(phone.replace(/-/g, ""));

  function handlePhoneChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    setPhone(formatted);
  }

  async function sendPhoneCode() {
    if (!phoneValid) return;
    setLoading(true);
    setError(null);
    try {
      await sendFindIdCodeApi(phone);
      setPhoneStatus("sent");
    } catch {
      setError("인증번호 발송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyPhoneCode() {
    if (!phoneCode) return;
    setLoading(true);
    setError(null);
    try {
      const email = await verifyFindIdCodeApi(phone, phoneCode);
      setFoundId(email);
      setPhoneStatus("verified");
      setResult("found");
      startTimer();
    } catch {
      setError("인증번호가 올바르지 않거나 일치하는 계정이 없습니다.");
      setResult("notFound");
    } finally {
      setLoading(false);
    }
  }

  // 아이디 찾기 버튼 — 인증이 완료된 경우 즉시 결과 표시
  function handleSubmit() {
    if (phoneStatus !== "verified") {
      setError("휴대폰 인증을 완료해주세요.");
    }
  }

  function reset() {
    setResult("idle");
    setName("");
    setPhone("");
    setPhoneCode("");
    setPhoneStatus("idle");
    setError(null);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  return {
    name, setName,
    phone, handlePhoneChange, phoneValid,
    phoneCode, setPhoneCode,
    phoneStatus, sendPhoneCode, verifyPhoneCode,
    result, foundId,
    timeLeft, formatTime,
    error, loading,
    handleSubmit, reset,
  };
}