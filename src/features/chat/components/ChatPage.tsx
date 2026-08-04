import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import { useProducts } from "../../product/hooks/useProducts";
import { useAuth } from "../../auth/store/useAuth";
import { useMyAllergenSummary } from "../../allergen/hooks/useMyAllergenSummary";
import type { Message } from "../lib/chatEngine";
import { classify, buildReply, BotAvatar, Pill, MsgBubble } from "../lib/chatEngine";

interface ChatPageProps {
  onBack?: () => void;
  onManageFilter?: () => void;
}

const SUGGESTIONS = [
  "새우 없는 도시락 추천해줘", "당뇨에 좋은 간식 알려줘", "단백질 30g 이상 식품",
  "이번 주 가족 식단 짜줘", "셀리악 인증 상품", "5분 안에 만드는 요리",
];

interface HistoryItem { id: string; title: string; preview: string; time: string }
const HISTORY: HistoryItem[] = [
  { id: "h1", title: "오늘 새로운 대화", preview: "안녕하세요...", time: "방금" },
  { id: "h2", title: "주간 식단 추천", preview: "월~금 식단표를 정리해 드렸어요", time: "어제" },
  { id: "h3", title: "저당 간식 비교", preview: "한라봉 주스 vs 그릭요거트...", time: "3일 전" },
];

const ChatPage: FC<ChatPageProps> = ({ onBack, onManageFilter }) => {
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "bot", intent: "greeting" }]);
  const [activeHistory, setActiveHistory] = useState("h1");
  const [showJump, setShowJump] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const { user } = useAuth();
  const { products } = useProducts();
  const { allergenNames, diseaseNames } = useMyAllergenSummary();

  useEffect(() => {
    if (scrollRef.current && stickToBottom.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distance < 80;
    stickToBottom.current = atBottom;
    setShowJump(!atBottom);
  }

  function jumpToBottom() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    stickToBottom.current = true;
    setShowJump(false);
  }

  function send(txt?: string) {
    const t = (txt ?? input).trim();
    if (!t) return;
    stickToBottom.current = true;
    setShowJump(false);
    setMessages(m => [...m, { role: "user", text: t }]);
    setInput("");
    setTyping(true);
    const delay = 600 + Math.random() * 400;
    setTimeout(() => {
      const intent = classify(t);
      const payload = buildReply(intent, products);
      setTyping(false);
      setMessages(m => [...m, { role: "bot", intent, payload }]);
    }, delay);
  }

  function newChat() {
    setActiveHistory("h1");
    setMessages([{ role: "bot", intent: "greeting" }]);
  }

  const profileLine = [
    allergenNames.length > 0 ? allergenNames.join("·") : null,
    diseaseNames.length > 0 ? diseaseNames.join("·") + " 케어" : null,
  ].filter(Boolean).join(" / ");

  return (
    <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>

      {/* 안전 필터 배너 */}
      <div style={{ background: "#1F4D2C", color: "#fff", padding: "9px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontSize: 12 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ color: "#A8E063", fontWeight: 700 }}>✓ 안전 필터 ON</span>
          {user?.name && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: "rgba(255,255,255,0.85)" }}>
                {user.name}님{profileLine && ` / ${profileLine} 적용 중`}
              </span>
            </>
          )}
        </span>
        <button onClick={onManageFilter} style={{ background: "transparent", border: "none", color: "#A8E063", fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}>
          필터 관리 ›
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* 좌측 대화 목록 사이드바 */}
        <aside style={{ width: 260, flexShrink: 0, background: "#fff", borderRight: "1px solid #E5E7E1", color: "#0F1E12", display: "flex", flexDirection: "column", padding: 16, minHeight: 0, overflowY: "auto" }}>
          <button
            onClick={newChat}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "#1F4D2C", color: "#fff", border: "none", borderRadius: 10,
              padding: "10px 0", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 20,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
            새 대화
          </button>

          <div style={{ fontSize: 11, fontWeight: 700, color: "#9AA89D", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>최근 대화</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
            {HISTORY.map(h => (
              <button
                key={h.id}
                onClick={() => setActiveHistory(h.id)}
                style={{
                  textAlign: "left", background: activeHistory === h.id ? "#F0F6F1" : "transparent",
                  border: "none", borderRadius: 8, padding: "9px 10px", cursor: "pointer", fontFamily: "inherit",
                  display: "flex", flexDirection: "column", gap: 2,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0F1E12", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.title}</span>
                  <span style={{ fontSize: 10, color: "#B0BAB3", flexShrink: 0 }}>{h.time}</span>
                </div>
                <span style={{ fontSize: 11, color: "#6B7A6E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.preview}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* 메인 채팅 영역 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>

          {/* 헤더 */}
          <div style={{ padding: "14px 24px", borderBottom: "1px solid #E5E7E1", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <BotAvatar />
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#0F1E12" }}>pickfood 도우미</div>
                <div style={{ fontSize: 11.5, color: "#6B7A6E", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, background: "#4CAF50", borderRadius: 999 }} />
                  온라인 · {user?.name ? `${user.name}님 프로필 인식 중` : "비로그인 모드"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#9AA89D", fontWeight: 700, marginRight: 2 }}>프로필</span>
              {allergenNames.map(a => <Pill key={a} color="#B71C1C" bg="#FEF2F2">{a} 알레르기</Pill>)}
              {diseaseNames.map(d => <Pill key={d} color="#B97308" bg="#FFF8EC">{d}</Pill>)}
              <button
                onClick={onBack}
                style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid #E5E7E1", background: "#fff", color: "#3A4A3F", fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer", marginLeft: 4 }}
              >대화 나가기</button>
            </div>
          </div>

          {/* 메시지 */}
          <div style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div ref={scrollRef} onScroll={handleScroll} style={{ flex: 1, minHeight: 0, padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, background: "#FAFAF7" }}>
            <div style={{ maxWidth: 720, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
              {messages.map((m, i) => (
                <MsgBubble
                  key={i}
                  m={m}
                  onSend={send}
                  greetingTitle={`안녕하세요, ${user?.name ?? "회원"}님 👋`}
                  greetingBody={
                    <>
                      {profileLine ? <><strong>{profileLine}</strong> 프로필을 기억하고 있어요.</> : "프로필을 기억하고 있어요."}{" "}
                      아래 추천 질문을 선택하거나 자유롭게 물어보세요.
                    </>
                  }
                />
              ))}
              {typing && (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <BotAvatar />
                  <div style={{ background: "#fff", border: "1px solid #E5E7E1", borderRadius: "14px 14px 14px 4px", padding: "12px 14px", display: "flex", gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{ width: 6, height: 6, background: "#9AA89D", borderRadius: 999, display: "block", animation: `pfScaleIn ${0.4 + i * 0.2}s ease-in-out infinite alternate` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {showJump && (
            <button
              onClick={jumpToBottom}
              aria-label="맨 아래로 이동"
              style={{
                position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
                display: "flex", alignItems: "center", gap: 6,
                background: "#0F1E12", color: "#fff", border: "none", borderRadius: 999,
                padding: "8px 14px", fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                cursor: "pointer", boxShadow: "0 8px 20px rgba(15,30,18,0.28)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              맨 아래로
            </button>
          )}
          </div>

          {/* 추천 질문 */}
          {messages.length <= 1 && !typing && (
            <div style={{ padding: "0 24px 12px" }}>
              <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
                {SUGGESTIONS.map(q => (
                  <button key={q} onClick={() => send(q)} style={{ padding: "7px 12px", fontFamily: "inherit", fontSize: 12, fontWeight: 600, border: "1px solid #DCE9DF", background: "#fff", color: "#1F4D2C", borderRadius: 999, cursor: "pointer" }}>{q}</button>
                ))}
              </div>
            </div>
          )}

          {/* 입력창 */}
          <form onSubmit={e => { e.preventDefault(); send(); }} style={{ padding: "14px 24px 20px", borderTop: "1px solid #E5E7E1", background: "#fff" }}>
            <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 8, alignItems: "center" }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                placeholder="무엇을 도와드릴까요?"
                style={{ flex: 1, fontFamily: "inherit", fontSize: 14, padding: "12px 16px", borderRadius: 999, border: "1px solid #E5E7E1", background: "#F4F5F1", outline: "none" }}
              />
              <button type="submit" style={{ width: 42, height: 42, borderRadius: 999, border: "none", background: input.trim() ? "#1F4D2C" : "#DDE2DC", color: "#fff", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke={input.trim() ? "#fff" : "#9AA89D"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <div style={{ fontSize: 10, color: "#9AA89D", textAlign: "center", marginTop: 8 }}>
              의료 진단을 대체하지 않습니다. 알레르기·질환은 의료진과 상담하세요.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
