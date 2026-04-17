import { apiClient } from "../../../shared/lib/apiClient";

// ── 공통 응답 타입 ─────────────────────────────────────────────────────────────
interface ApiResponse<T> {
  resultCode: string;
  data: T;
}

// ── 닉네임 중복 검사 (GET) ─────────────────────────────────────────────────────
export async function checkNickname(nickname: string): Promise<boolean> {
  const res = await apiClient.get<ApiResponse<{ available: boolean }>>(
    "/auth/check-nickname",
    { params: { nickname } }
  );
  return res.data.data.available;
}

// ── 이메일 인증번호 발송 (POST) ────────────────────────────────────────────────
export async function sendEmailCode(email: string): Promise<string> {
  const res = await apiClient.post<ApiResponse<{ message: string }>>(
    "/auth/email/send-code",
    { email }
  );
  return res.data.data.message;
}

// ── 이메일 인증번호 확인 (POST) ────────────────────────────────────────────────
export async function verifyEmailCode(email: string, code: string): Promise<boolean> {
  const res = await apiClient.post<ApiResponse<{ verified: boolean }>>(
    "/auth/email/verify-code",
    { email, code }
  );
  return res.data.data.verified;
}

// ── 휴대폰 중복 검사 (GET) ─────────────────────────────────────────────────────
export async function checkPhone(phone: string): Promise<boolean> {
  const res = await apiClient.get<ApiResponse<{ available: boolean }>>(
    "/auth/check-phone",
    { params: { phone: phone.replace(/-/g, "") } }
  );
  return res.data.data.available;
}

// ── 회원가입 (POST) ────────────────────────────────────────────────────────────
export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  nickname: string;
  phone: string;
  term_ids: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  nickname: string;
  role: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: AuthUser;
}

export async function signup(payload: SignupPayload): Promise<AuthTokens> {
  const res = await apiClient.post<ApiResponse<AuthTokens>>(
    "/auth/signup",
    payload
  );
  return res.data.data;
}

// ── 로그인 (POST) ──────────────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<AuthTokens> {
  const res = await apiClient.post<ApiResponse<AuthTokens>>(
    "/auth/login",
    { email, password }
  );
  return res.data.data;
}

// ── 약관 목록 조회 (GET) ───────────────────────────────────────────────────────
export interface Term {
  id: string;
  name: string;
  version: string;
  content: string;
  is_required: boolean;
  effective_at: string;
}

export async function getTerms(): Promise<Term[]> {
  const res = await apiClient.get<ApiResponse<Term[]>>("/auth/terms");
  return res.data.data;
}

// ── 아이디 찾기 — 인증번호 발송 (POST) ────────────────────────────────────────
export async function sendFindIdCode(phone: string): Promise<string> {
  const res = await apiClient.post<ApiResponse<{ maskedEmail: string }>>(
    "/auth/find-email/send-code",
    { phone: phone.replace(/-/g, "") }
  );
  return res.data.data.maskedEmail;
}

// ── 아이디 찾기 — 인증번호 확인 (POST) ────────────────────────────────────────
export async function verifyFindIdCode(phone: string, code: string): Promise<string> {
  const res = await apiClient.post<ApiResponse<{ email: string }>>(
    "/auth/find-email/verify-code",
    { phone: phone.replace(/-/g, ""), code }
  );
  return res.data.data.email;
}

// ── 비밀번호 재설정 메일 발송 (POST) ──────────────────────────────────────────
export async function forgotPassword(email: string): Promise<boolean> {
  const res = await apiClient.post<ApiResponse<{ ok: boolean }>>(
    "/auth/password/forgot",
    { email }
  );
  return res.data.data.ok;
}

// ── 로그아웃 (POST) ────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// ── 내 프로필 조회 (GET) ───────────────────────────────────────────────────────
export interface MyProfile {
  id: string;
  email: string;
  name: string;
  nickname: string;
  phone: string;
  role: string;
  buyer_grade: string;
  is_phone_verified: boolean;
  profile_file_id: string;
  created_at: string;
  is_terms_agreed: boolean;
}

export async function getMyProfile(): Promise<MyProfile> {
  const res = await apiClient.get<ApiResponse<MyProfile>>("/auth/me");
  return res.data.data;
}