import { useState, useEffect, useRef } from "react";
import {
  checkNickname as checkNicknameApi,
  sendEmailCode as sendEmailCodeApi,
  verifyEmailCode as verifyEmailCodeApi,
  sendPhoneCode as sendPhoneCodeApi,
  verifyPhoneCode as verifyPhoneCodeApi,
  signup as signupApi,
  getTerms,
} from "../services/authApi";
import type { Term } from "../services/authApi";
import { useAuth } from "../store/useAuth";
import { hasHangul, romanizeKoreanName, saveLocalDisplayName } from "../utils/displayName";

type NicknameStatus = "idle" | "available" | "duplicate";
type VerifyStatus   = "idle" | "sent" | "verified";

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string>;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  const body = (err as { response?: { data?: ApiErrorBody } })?.response?.data;
  if (!body) return fallback;
  const fieldMessages = body.errors ? Object.values(body.errors) : [];
  if (fieldMessages.length > 0) return fieldMessages.join("\n");
  return body.message ?? fallback;
}

export function useSignup(onComplete?: () => void | Promise<void>) {
  const { login: setAuth } = useAuth();

  // 항상 최신 콜백을 가리키도록 ref 사용 (SignupPage가 매 렌더마다 새 함수 전달해도 안전)
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [name,           setName]           = useState("");
  const [nickname,       setNickname]       = useState("");
  const [email,          setEmail]          = useState("");
  const [emailCode,      setEmailCode]      = useState("");
  const [password,       setPassword]       = useState("");
  const [confirmPw,      setConfirmPw]      = useState("");
  const [phone,          setPhone]          = useState("");
  const [phoneVerifyCode,          setPhoneVerifyCode]          = useState("");
  const [phoneVerificationToken,  setPhoneVerificationToken]  = useState("");
  const [termsAgreed,             setTermsAgreed]             = useState(false);
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

  // ── 닉네임 중복 검사  GET /auth/check-nickname ─────────────────────────────
  async function checkNickname() {
    if (!nickname) return;
    try {
      const available = await checkNicknameApi(nickname);
      setNicknameStatus(available ? "available" : "duplicate");
    } catch (err) {
      setNicknameStatus("duplicate");
      setError(extractErrorMessage(err, "닉네임 중복 검사에 실패했습니다."));
    }
  }

  // ── 이메일 인증번호 발송  POST /auth/email/send-code ───────────────────────
  async function sendEmailCode() {
    if (!email) return;
    try {
      await sendEmailCodeApi(email);
      setEmailStatus("sent");
    } catch (err) {
      setError(extractErrorMessage(err, "이메일 발송에 실패했습니다."));
    }
  }

  // ── 이메일 인증번호 확인  POST /auth/email/verify-code ─────────────────────
  async function verifyEmailCode() {
    if (!emailCode) return;
    try {
      const verified = await verifyEmailCodeApi(email, emailCode);
      setEmailStatus(verified ? "verified" : "sent");
      if (!verified) setError("인증번호가 올바르지 않습니다.");
    } catch (err) {
      setError(extractErrorMessage(err, "인증번호 확인에 실패했습니다."));
    }
  }

  // ── 휴대폰 인증 시작  POST /auth/phone/start ───────────────────────────────
  async function sendPhoneCode() {
    if (!phone) return;
    setLoading(true);
    setError(null);
    try {
      const code = await sendPhoneCodeApi(phone);
      setPhoneVerifyCode(code);
      setPhoneStatus("sent");
    } catch (err) {
      setError(extractErrorMessage(err, "휴대폰 인증번호 발송에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  }

  // ── 휴대폰 인증 완료  POST /auth/phone/verify ──────────────────────────────
  async function verifyPhoneCode() {
    setLoading(true);
    setError(null);
    try {
      const result = await verifyPhoneCodeApi(phone);
      if (result.verified) {
        setPhoneStatus("verified");
        const raw = result.verificationToken ?? result.token ?? result.verification_token ?? result.phone_token ?? result.phoneToken;
        const tok = typeof raw === "string" ? raw : "";
        if (tok) setPhoneVerificationToken(tok);
      } else {
        setPhoneStatus("sent");
        setError("아직 SMS 인증이 완료되지 않았습니다.");
      }
    } catch (err) {
      setError(extractErrorMessage(err, "인증 확인에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  }

  // ── 회원가입  POST /auth/signup ────────────────────────────────────────────
  async function handleSubmit() {
    if (!name)                           { setError("이름을 입력해주세요."); return; }
    if (!nickname)                       { setError("닉네임을 입력해주세요."); return; }
    if (nicknameStatus !== "available")  { setError("닉네임 중복 검사를 해주세요."); return; }
    if (!email)                          { setError("이메일을 입력해주세요."); return; }
    if (emailStatus !== "verified")      { setError("이메일 인증을 완료해주세요."); return; }
    if (!phone)                          { setError("휴대폰 번호를 입력해주세요."); return; }
    if (phoneStatus !== "verified")      { setError("휴대폰 인증을 완료해주세요."); return; }
    if (!password)                       { setError("비밀번호를 입력해주세요."); return; }
    if (!passwordValid)                  { setError("비밀번호 형식이 올바르지 않습니다."); return; }
    if (!passwordMatch)                  { setError("비밀번호가 일치하지 않습니다."); return; }
    if (!termsAgreed)                    { setError("약관에 동의해주세요."); return; }

    setLoading(true);
    setError(null);
    try {
      const requiredTermIds = terms.filter(t => t.is_required).map(t => t.id);
      // 백엔드가 한글 name을 거부하는 버그 우회: 한글이면 로마자로 변환해 보내고,
      // 원래 한글 이름은 saveLocalDisplayName으로 보관해 화면엔 항상 한글로 표시한다.
      const submittedName = hasHangul(name) ? romanizeKoreanName(name) : name;
      const tokens = await signupApi({
        email,
        password,
        name: submittedName,
        nickname,
        phone: phone.replace(/-/g, ""),
        phone_verification_token: phoneVerificationToken,
        term_ids: requiredTermIds,
      });
      saveLocalDisplayName(tokens.user.id, name);
      setAuth(tokens);
      await onCompleteRef.current?.();
    } catch (err) {
      setError(extractErrorMessage(err, "회원가입에 실패했습니다. 다시 시도해주세요."));
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
    phoneVerifyCode,
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
