import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import { useProducts } from "../../product/hooks/useProducts";
import { useAuth } from "../../auth/store/useAuth";
import type { Message } from "../lib/chatEngine";
import { classify, buildReply, BotAvatar, Pill, MsgBubble } from "../lib/chatEngine";

// ── Chatbot ───────────────────────────────────────────────────────────────────

const SUGGESTIONS = ["새우 없는 상품 추천", "당뇨에 좋은 간식", "단백질 30g+ 상품", "이번 주 가족 식단"];
const USER_ALLERGENS = ["새우", "게"];
const USER_DISEASES = ["당뇨"];

const Chatbot: FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "bot", intent: "greeting" }]);
  const panelRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuth();
  const { products } = useProducts();

  useEffect(() => {
    function handleOpenChat() { setOpen(true); }
    window.addEventListener("pickfood:openchat", handleOpenChat);
    return () => window.removeEventListener("pickfood:openchat", handleOpenChat);
  }, []);

  useEffect(() => {
    if (!open) return;
    function outside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && !(e.target as HTMLElement).closest("[data-chatbot-fab]")) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [open]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.parentElement!.scrollTop = endRef.current.parentElement!.scrollHeight;
    }
  }, [messages, typing]);

  function send(txt?: string) {
    const t = (txt ?? input).trim();
    if (!t) return;
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

  return (
    <>
      {/* FAB */}
      <button
        data-chatbot-fab
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 70,
          width: 60, height: 60, borderRadius: 999, border: "none", cursor: "pointer",
          background: open ? "#0F1E12" : "#1F4D2C",
          boxShadow: "0 16px 40px rgba(15,30,18,0.28), 0 0 0 4px rgba(168,224,99,0.28)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 220ms cubic-bezier(0.2,0,0,1), background 200ms",
          transform: open ? "scale(0.92) rotate(8deg)" : "scale(1)",
        }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke="#A8E063" strokeWidth="2" strokeLinecap="round"/></svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 0 1-12.4 6.7L4 20l1.3-4.6A8 8 0 1 1 21 12Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
        )}
        {!open && (
          <span style={{ position: "absolute", top: 6, right: 6, width: 10, height: 10, background: "#A8E063", borderRadius: 999, border: "2px solid #1F4D2C", animation: "pfScaleIn 1.6s ease-in-out infinite alternate" }} />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div ref={panelRef} className="pf-scale-in" style={{
          position: "fixed", bottom: 96, right: 24, zIndex: 70,
          width: 400, height: 620, background: "#fff",
          borderRadius: 20, boxShadow: "0 24px 64px rgba(15,30,18,0.22)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          border: "1px solid #E5E7E1", transformOrigin: "bottom right",
        }}>
          {/* Header */}
          <div style={{ padding: "14px 18px", background: "linear-gradient(135deg, #0F1E12 0%, #1F4D2C 100%)", color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 999, background: "rgba(168,224,99,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" stroke="#A8E063" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z" stroke="#A8E063" strokeWidth="1.4" fill="none"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-0.01em" }}>pickfood 도우미</div>
              <div style={{ fontSize: 11, color: "#A8E063", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, background: "#A8E063", borderRadius: 999 }} />
                {isLoggedIn ? "내 프로필 인식 중" : "비로그인 모드"}
              </div>
            </div>
            <button onClick={() => { setMessages([{ role: "bot", intent: "greeting" }]); }} style={{ width: 32, height: 32, borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M3 21v-5h5" stroke="#DCE9DF" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
            <button onClick={() => setOpen(false)} style={{ width: 32, height: 32, borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke="#DCE9DF" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Profile chips */}
          <div style={{ padding: "10px 16px", background: "#FAFAF7", borderBottom: "1px solid #F0F2EC", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: "#6B7A6E", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>적용 프로필</span>
            {USER_ALLERGENS.map(a => <Pill key={a} color="#B71C1C" bg="#FEF2F2">⚠️ {a}</Pill>)}
            {USER_DISEASES.map(d => <Pill key={d} color="#B97308" bg="#FFF8EC">{d}</Pill>)}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, background: "#FAFAF7" }}>
            {messages.map((m, i) => <MsgBubble key={i} m={m} onSend={send} />)}
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
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && !typing && (
            <div style={{ padding: "0 16px 8px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#6B7A6E", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>추천 질문</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {SUGGESTIONS.map(q => (
                  <button key={q} onClick={() => send(q)} style={{ padding: "6px 11px", fontFamily: "inherit", fontSize: 12, fontWeight: 600, border: "1px solid #DCE9DF", background: "#fff", color: "#1F4D2C", borderRadius: 999, cursor: "pointer" }}>{q}</button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={e => { e.preventDefault(); send(); }} style={{ padding: 12, borderTop: "1px solid #E5E7E1", background: "#fff", display: "flex", gap: 8, alignItems: "center" }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder="무엇을 도와드릴까요?"
              style={{ flex: 1, fontFamily: "inherit", fontSize: 14, padding: "10px 14px", borderRadius: 999, border: "1px solid #E5E7E1", background: "#F4F5F1", outline: "none" }}
            />
            <button type="submit" style={{ width: 38, height: 38, borderRadius: 999, border: "none", background: input.trim() ? "#1F4D2C" : "#DDE2DC", color: "#fff", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke={input.trim() ? "#fff" : "#9AA89D"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </form>
          <div style={{ fontSize: 10, color: "#9AA89D", textAlign: "center", padding: "0 12px 10px" }}>
            의료 진단을 대체하지 않습니다. 알레르기·질환은 의료진과 상담하세요.
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
