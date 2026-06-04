import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.pickfood.co.kr";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// ── Request interceptor — access token 자동 주입 ──────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — 에러 공통 처리 ────────────────────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // 토큰이 있는 요청에서만 세션 만료 처리
      // (비로그인 상태에서 public 엔드포인트가 401을 내려도 페이지를 강제 이동하지 않음)
      const hadToken = !!(error.config?.headers?.Authorization);
      if (hadToken) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // window.location.href = "/" 대신 커스텀 이벤트 — React 상태로 처리
        window.dispatchEvent(new CustomEvent("pickfood:session-expired"));
      }
    }

    return Promise.reject(error);
  }
);
