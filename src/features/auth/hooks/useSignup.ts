import { useState, useEffect } from "react";
import {
  checkNickname as checkNicknameApi,
  sendEmailCode as sendEmailCodeApi,
  verifyEmailCode as verifyEmailCodeApi,
  signup as signupApi,
  getTerms,
} from "../services/authApi";
import type { Term } from "../services/authApi";
import { useAuth } from "../store/useAuth";

type NicknameStatus = "idle" | "available" | "duplicate";
type VerifyStatus   = "idle" | "sent" | "verified";

export function useSignup() {
  const { login: setAuth } = useAuth();

  const [name,           setName]           = useState("");
  const [nickname,       setNickname]       = useState("");
  const [email,          setEmail]          = useState("");
  const [emailCode,      setEmailCode]      = useState("");
  const [password,       setPassword]       = useState("");
  const [confirmPw,      setConfirmPw]      = useState("");
  const [phone,          setPhone]          = useState("");
  const [phoneCode,      setPhoneCode]      = useState("");
  const [termsAgreed,    setTermsAgreed]    = useState(false);
  const [showPassword,   setShowPassword]   = useState(false);
  const [showConfirmPw,  setShowConfirmPw]  = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>("idle");
  const [emailStatus,    setEmailStatus]    = useState<VerifyStatus>("idle");
  const [phoneStatus,    setPhoneStatus]    = useState<VerifyStatus>("idle");
  const [terms,          setTerms]          = useState<Term[]>([]);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState<string | null>(null);

  // 약관 목록 로드
  useEffect(() => {
    getTerms().then(setTerms).catch(() => {});
  }, []);

  const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password);
  const passwordMatch    = password !== "" && confirmPw !== "" && password === confirmPw;
  const passwordMismatch = confirmPw !== "" && password !== confirmPw;

  async function checkNickname() {
    if (!nickname) return;
    try {
      const available = await checkNicknameApi(nickname);
      setNicknameStatus(available ? "available" : "duplicate");
    } catch {
      setNicknameStatus("duplicate");
    }
  }

  async function sendEmailCode() {
    if (!email) return;
    try {
      await sendEmailCodeApi(email);
      setEmailStatus("sent");
    } catch {
      setError("이메일 발송에 실패했습니다.");
    }
  }

  async function verifyEmailCode() {
    if (!emailCode) return;
    try {
      const verified = await verifyEmailCodeApi(email, emailCode);
      setEmailStatus(verified ? "verified" : "sent");
      if (!verified) setError("인증번호가 올바르지 않습니다.");
    } catch {
      setError("인증번호 확인에 실패했습니다.");
    }
  }

  // 휴대폰은 UI만 (별도 SMS API 없음 — 백엔드 확인 후 추가)
  function sendPhoneCode() { setPhoneStatus("sent"); }
  function verifyPhoneCode() { setPhoneStatus("verified"); }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const requiredTermIds = terms
        .filter((t) => t.is_required)
        .map((t) => t.id);

      const tokens = await signupApi({
        email,
        password,
        name,
        nickname,
        phone: phone.replace(/-/g, ""),
        term_ids: requiredTermIds,
      });
      setAuth(tokens);
    } catch {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
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
    terms, loading, error,
    handleSubmit,
  };
}