import type { FC } from "react";
import type { Product } from "../../product/models/type";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Message {
  role: "bot" | "user";
  text?: string;
  intent?: string;
  payload?: BotPayload;
}

export interface BotPayload {
  text: string;
  products?: Product[];
  stats?: { k: string; v: string }[];
  plan?: { day: string; b: string; l: string; d: string }[];
  recipe?: { title: string; time: string; kcal: number; ingredients: string[]; steps: string[] };
  followUps?: string[];
}

// ── Intent classifier ─────────────────────────────────────────────────────────

export function classify(t: string): string {
  const x = t.toLowerCase();
  if (x.includes("알레르기") || x.includes("새우") || x.includes("땅콩") || x.includes("안전")) return "allergy";
  if (x.includes("당뇨") || x.includes("저당") || x.includes("혈당") || x.includes("당류")) return "diabetes";
  if (x.includes("단백질") || x.includes("운동") || x.includes("30g")) return "protein";
  if (x.includes("식단") || x.includes("주간") || x.includes("가족") || x.includes("일주일")) return "mealPlan";
  if (x.includes("레시피") || x.includes("요리")) return "recipe";
  if (x.includes("추천") || x.includes("뭐")) return "recommend";
  return "general";
}

export function buildReply(intent: string, products: Product[]): BotPayload {
  const safe = products.slice(0, 3);
  if (intent === "allergy") return {
    text: "프로필 기준으로 검사한 결과 **안전 제품 3가지** 추천드릴게요. 모두 알레르기 검증 완료 상품이에요.",
    products: safe,
    followUps: ["고단백 위주로", "저당 위주로", "관련 정보 더 보기"],
  };
  if (intent === "diabetes") return {
    text: "당뇨 관리 라인으로 **당류 5g 이하 + 저GI** 기준으로 골랐어요.",
    products: safe,
    stats: [{ k: "평균 당류", v: "2.1g" }, { k: "평균 나트륨", v: "180mg" }, { k: "평균 GI", v: "52" }],
    followUps: ["당뇨 식단표", "저당 빵 추천", "가족에게 알려줘"],
  };
  if (intent === "protein") return {
    text: "단백질 함량 **TOP 3** 상품이에요. 운동 후 하루 30g 목표라면 아래 조합으로 충분해요.",
    products: safe,
    followUps: ["하루 단백질 식단", "고단백 간식", "비건 단백질만"],
  };
  if (intent === "mealPlan") return {
    text: "알레르기·당뇨 프로필에 맞춰 **5일치 가족 식단**을 짜드릴게요. 하루 평균 1,750kcal · 당류 22g.",
    plan: [
      { day: "월", b: "유기농 그래놀라", l: "닭가슴살 샐러드", d: "연어 스테이크" },
      { day: "화", b: "그릭요거트 + 견과", l: "현미밥 + 두부", d: "닭볶음탕" },
      { day: "수", b: "검정콩두유 + 과일", l: "글루텐프리 파스타", d: "두부 스크램블" },
      { day: "목", b: "쌀과자 + 차", l: "현미밥 + 나물", d: "닭 가이야 볶음" },
      { day: "금", b: "바나나 + 단백질바", l: "연어 오니기리", d: "된장찌개" },
    ],
    followUps: ["장보기 리스트로 변환", "주말 포함 7일로", "아이용 식단"],
  };
  if (intent === "recipe") return {
    text: "프로필(새우·게 알레르기)에 안전한 **5분 두부 스크램블** 레시피예요. 1인분 단백질 22g · 당류 3g.",
    recipe: {
      title: "5분 두부 스크램블",
      time: "5분", kcal: 220,
      ingredients: ["국내산 유기농 두부 ½합", "시금치 한 줌", "계란 1개", "올리브오일 1티스푼", "간장·후추"],
      steps: ["두부를 손으로 으깨어 물기 제거", "시금치 30초 볶기", "두부+간 넣고 3분 볶기", "계란 풀어 1분 마무리"],
    },
    followUps: ["계란 빼고 만드는 법", "더 비슷한 레시피", "식단에 추가"],
  };
  if (intent === "recommend") return {
    text: "프로필 기준 이번 주 **인기 안전 상품**이에요. 알레르기·질병 기준 모두 충족!",
    products: safe,
    followUps: ["알레르기 없는 상품", "저당 상품", "고단백 상품"],
  };
  return {
    text: "무엇을 도와드릴까요? 알레르기·질병·식단 목표 중 어떤 부분이 가장 중요하신가요?",
    followUps: ["새우 없는 상품 추천", "저당 상품", "고단백 상품", "주간 식단 짜줘"],
  };
}

// ── Sub components ────────────────────────────────────────────────────────────

export const BotAvatar = () => (
  <div style={{ width: 28, height: 28, borderRadius: 999, background: "linear-gradient(135deg, #0F1E12, #1F4D2C)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "inset 0 0 0 1.5px rgba(168,224,99,0.4)" }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" stroke="#A8E063" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z" stroke="#A8E063" strokeWidth="1.4" fill="none"/>
    </svg>
  </div>
);

export const Pill: FC<{ children: React.ReactNode; color?: string; bg?: string }> = ({ children, color = "#1F4D2C", bg = "#EAF7D4" }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color, background: bg, padding: "3px 7px", borderRadius: 999 }}>{children}</span>
);

export function renderMd(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} style={{ color: "#0F1E12" }}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────

export const MsgBubble: FC<{ m: Message; onSend: (t: string) => void; greetingTitle?: string; greetingBody?: React.ReactNode }> = ({
  m, onSend, greetingTitle = "안녕하세요, pickfood 🌿", greetingBody,
}) => {
  if (m.role === "user") {
    return (
      <div style={{ alignSelf: "flex-end", background: "#0F1E12", color: "#fff", borderRadius: "14px 14px 4px 14px", padding: "10px 14px", maxWidth: "78%", fontSize: 13, lineHeight: 1.55 }}>
        {m.text}
      </div>
    );
  }

  if (m.intent === "greeting") {
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <BotAvatar />
        <div style={{ background: "#fff", border: "1px solid #E5E7E1", borderRadius: "14px 14px 14px 4px", padding: 14, maxWidth: "85%" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F1E12", marginBottom: 6 }}>{greetingTitle}</div>
          <div style={{ fontSize: 12, color: "#3A4A3F", lineHeight: 1.6 }}>
            {greetingBody ?? <><strong>알레르기·질병 프로필</strong>을 기억하고 있어요. 무엇을 골라드릴까요?</>}
          </div>
        </div>
      </div>
    );
  }

  const p = m.payload!;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      <BotAvatar />
      <div style={{ flex: 1, maxWidth: "85%", display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Text */}
        <div style={{ background: "#fff", border: "1px solid #E5E7E1", borderRadius: "14px 14px 14px 4px", padding: 14, fontSize: 13, lineHeight: 1.6, color: "#0F1E12" }}>
          {renderMd(p.text)}
        </div>

        {/* Stats */}
        {p.stats && (
          <div style={{ background: "#F0F6F1", borderRadius: 10, padding: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {p.stats.map(s => (
              <div key={s.k}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#6B7A6E", letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.k}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#1F4D2C", marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        {p.products && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {p.products.map(prod => (
              <div key={prod.id} style={{ background: "#fff", border: "1px solid #E5E7E1", borderRadius: 10, padding: 10, display: "flex", gap: 10, alignItems: "center" }}>
                <img src={prod.imageSrc} alt="" style={{ width: 48, height: 48, borderRadius: 6, objectFit: "cover", flexShrink: 0, background: "#F4F5F1" }} onError={e => { (e.target as HTMLImageElement).style.background = "#F4F5F1"; (e.target as HTMLImageElement).style.display = "none"; }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: "#6B7A6E" }}>{prod.brand}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0F1E12", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prod.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#0F1E12", marginTop: 2 }}>{prod.price.toLocaleString()}원</div>
                </div>
                <Pill>안전</Pill>
              </div>
            ))}
          </div>
        )}

        {/* Meal plan */}
        {p.plan && (
          <div style={{ background: "#fff", border: "1px solid #E5E7E1", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ background: "#0F1E12", color: "#A8E063", padding: "8px 12px", fontSize: 11, fontWeight: 800, letterSpacing: "0.04em" }}>5일 식단표</div>
            {p.plan.map((row, i) => (
              <div key={i} style={{ padding: "8px 12px", borderTop: i ? "1px solid #F4F5F1" : "none", display: "grid", gridTemplateColumns: "28px 1fr 1fr 1fr", gap: 6, fontSize: 11 }}>
                <span style={{ fontWeight: 800, color: "#0F1E12" }}>{row.day}</span>
                <span style={{ color: "#3A4A3F" }}>{row.b}</span>
                <span style={{ color: "#3A4A3F" }}>{row.l}</span>
                <span style={{ color: "#3A4A3F" }}>{row.d}</span>
              </div>
            ))}
          </div>
        )}

        {/* Recipe */}
        {p.recipe && (
          <div style={{ background: "#fff", border: "1px solid #E5E7E1", borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#0F1E12" }}>{p.recipe.title}</span>
              <span style={{ fontSize: 11, color: "#6B7A6E" }}>· {p.recipe.time} · {p.recipe.kcal}kcal</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7A6E", textTransform: "uppercase", marginBottom: 4 }}>재료</div>
            <div style={{ fontSize: 11, color: "#3A4A3F", lineHeight: 1.6 }}>{p.recipe.ingredients.join(" · ")}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7A6E", textTransform: "uppercase", marginTop: 8, marginBottom: 4 }}>조리법</div>
            <ol style={{ margin: 0, paddingLeft: 16 }}>
              {p.recipe.steps.map((s, i) => <li key={i} style={{ fontSize: 11, color: "#3A4A3F", lineHeight: 1.6 }}>{s}</li>)}
            </ol>
          </div>
        )}

        {/* Follow-ups */}
        {p.followUps && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {p.followUps.map(q => (
              <button key={q} onClick={() => onSend(q)} style={{ padding: "5px 10px", fontFamily: "inherit", fontSize: 11, fontWeight: 600, border: "1px solid #DCE9DF", background: "#fff", color: "#1F4D2C", borderRadius: 999, cursor: "pointer" }}>{q}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
