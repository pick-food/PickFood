import { apiClient } from "./apiClient";

/**
 * AiutoForm 위젯 정식 세션 — 시험용 (index.html 의 위젯 스크립트와 함께 지우면 됨).
 * 로그인 후 백엔드 POST /aiutoform/session 으로 위젯 토큰을 받아 위젯에 넘긴다.
 * 안 넘기면 위젯은 체험 모드(양식 등록 불가)로 뜬다.
 */
declare global {
  interface Window {
    AiutoForm?: { setSession(token: string, expiresAt: string): void };
  }
}

export async function connectAiutoForm(): Promise<void> {
  let session: { token: string; expiresAt: string };
  try {
    const res = await apiClient.post("/aiutoform/session");
    session = res.data?.data ?? res.data;
    if (typeof session?.token !== "string") return;
  } catch {
    return; // 설정 없음·실패 → 체험 모드 그대로
  }
  // 위젯 스크립트(defer)가 아직 안 떴을 수 있다 — 잠깐 기다린다.
  for (let i = 0; i < 50; i++) {
    if (window.AiutoForm) {
      window.AiutoForm.setSession(session.token, session.expiresAt);
      return;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
}
