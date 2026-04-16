import { useState } from "react";

type NicknameStatus = "idle" | "available" | "duplicate";
type VerifyStatus   = "idle" | "sent" | "verified";

export function useSignup() {
  // 폼 값
  const [name,           setName]           = useState("");
  const [nickname,       setNickname]       = useState("");
  const [email,          setEmail]          = useState("");
  const [emailCode,      setEmailCode]      = useState("");
  const [password,       setPassword]       = useState("");
  const [confirmPw,      setConfirmPw]      = useState("");
  const [phone,          setPhone]          = useState("");
  const [phoneCode,      setPhoneCode]      = useState("");
  const [termsAgreed,    setTermsAgreed]    = useState(false);

  // UI 상태
  const [showPassword,   setShowPassword]   = useState(false);
  const [showConfirmPw,  setShowConfirmPw]  = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>("idle");
  const [emailStatus,    setEmailStatus]    = useState<VerifyStatus>("idle");
  const [phoneStatus,    setPhoneStatus]    = useState<VerifyStatus>("idle");

  // ── 유효성 ────────────────────────────────────────────────────────────────────
  const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password);
  const passwordMatch = password !== "" && confirmPw !== "" && password === confirmPw;
  const passwordMismatch = confirmPw !== "" && password !== confirmPw;

  // ── 중복 검사 (TODO: API) ──────────────────────────────────────────────────────
  function checkNickname() {
    if (!nickname) return;
    // 임시: 홀수 길이면 사용 가능
    setNicknameStatus(nickname.length % 2 === 0 ? "duplicate" : "available");
  }

  // ── 이메일 인증번호 전송 (TODO: API) ──────────────────────────────────────────
  function sendEmailCode() {
    if (!email) return;
    setEmailStatus("sent");
  }
  function verifyEmailCode() {
    if (!emailCode) return;
    setEmailStatus("verified");
  }

  // ── 휴대폰 인증번호 전송 (TODO: API) ─────────────────────────────────────────
  function sendPhoneCode() {
    if (!phone) return;
    setPhoneStatus("sent");
  }
  function verifyPhoneCode() {
    if (!phoneCode) return;
    setPhoneStatus("verified");
  }

  // ── 다음으로 ──────────────────────────────────────────────────────────────────
  function handleSubmit() {
    // TODO: 백엔드 연동
    console.log({ name, nickname, email, password, phone, termsAgreed });
  }

  return {
    name, setName,
    nickname, setNickname,
    email, setEmail,
    emailCode, setEmailCode,
    password, setPassword,
    confirmPw, setConfirmPw,
    phone, setPhone,
    phoneCode, setPhoneCode,
    termsAgreed, setTermsAgreed,
    showPassword, setShowPassword,
    showConfirmPw, setShowConfirmPw,
    nicknameStatus, checkNickname,
    emailStatus, sendEmailCode, verifyEmailCode,
    phoneStatus, sendPhoneCode, verifyPhoneCode,
    passwordValid, passwordMatch, passwordMismatch,
    handleSubmit,
  };
}