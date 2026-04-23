import type { FC, ReactNode } from "react";
import { useRef, useState, useEffect } from "react";
import type { Product } from "../models/type";
import { useProductDetail } from "../../product/hooks/useProductDetail";
import { useToast } from "../hooks/useToast";
import Toast from "../../../shared/components/Toast";
import cartIcon   from "@/assets/icons/shoppingcart.png";
import couponIcon from "@/assets/icons/coupon.png";

interface ProductDetailPageProps {
  product: Product;
  onBack?: () => void;
}

// ── 공통 ───────────────────────────────────────────────────────────────────────
const Divider: FC = () => <div className="w-full h-px bg-[#BBBBBB]" />;

const InfoRow: FC<{ label: string; children: ReactNode; sub?: string }> = ({ label, children, sub }) => (
  <>
    <Divider />
    <div className="flex items-start py-[10px] gap-[30px]">
      <span className="text-[12px] font-medium text-gray-600 w-[90px] flex-shrink-0">{label}</span>
      <div className="flex flex-col gap-[2px]">
        <span className="text-[12px] font-medium text-gray-800">{children}</span>
        {sub && <span className="text-[11px] font-medium text-gray-400">{sub}</span>}
      </div>
    </div>
  </>
);

// ── 페이지네이션 ───────────────────────────────────────────────────────────────
const Pagination: FC<{ current: number; total: number; onChange: (p: number) => void }> = ({ current, total, onChange }) => (
  <div className="flex items-center justify-center gap-[4px] mt-6">
    <button onClick={() => onChange(Math.max(1, current - 1))}
      className="w-[31px] h-[31px] flex items-center justify-center bg-[#F0F0F0] border border-[#DDDDDD] rounded-xs text-gray-400">‹</button>
    {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
      <button key={p} onClick={() => onChange(p)}
        className={["w-[31px] h-[31px] flex items-center justify-center rounded-xs text-[15px] font-medium",
          p === current ? "border border-primary text-primary" : "text-gray-800 hover:text-primary"].join(" ")}>
        {p}
      </button>
    ))}
    <button onClick={() => onChange(Math.min(total, current + 1))}
      className="w-[31px] h-[31px] flex items-center justify-center bg-[#F0F0F0] border border-[#DDDDDD] rounded-xs text-gray-400">›</button>
  </div>
);

// ── 별점 SVG ──────────────────────────────────────────────────────────────────
const StarRow: FC<{ rating: number; size?: number }> = ({ rating, size = 20 }) => (
  <div className="flex items-center gap-[2px]">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24"
        fill={i < Math.floor(rating) ? "#FEE500" : "none"}
        stroke={i < Math.floor(rating) ? "none" : "#AAAAAA"}
        strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
);

// ── 후기 섹션 ──────────────────────────────────────────────────────────────────
const MOCK_REVIEWS = [
  { id: 1, name: "Joy Laugh", rating: 5, date: "2026.04.08",
    product: "몰가홀푸드 비건 귀리 그래놀라 500g, 1개",
    text: "가볍고 고소해서 데일리로 먹기 좋은 그래놀라!! 평소에 칼로리가 좀 낮고 그릭 요거트와 잘 어울리는 그래놀라를 찾고 있었는데, 다른 그래놀라보다 좀 덜 달고 요거트와 너무 잘 어울려서 맛있었어요. 하나만 사서 좀 아쉬운데 나중에 할인할때 여러개 사서 쟁여놓으려구요. 배송도 안전하게 잘 포장되어 와서 좋았습니다!",
    profile: "/images/profiles/profile1.png",
    images: ["/images/reviews/review1.png", "/images/reviews/review2.png", "/images/reviews/review3.png"] },
  { id: 2, name: "고*이", rating: 5, date: "2026.04.08",
    product: "몰가홀푸드 비건 귀리 그래놀라 500g, 1개",
    text: "가볍고 고소해서 데일리로 먹기 좋은 그래놀라!! 평소에 칼로리가 좀 낮고 그릭 요거트와 잘 어울리는 그래놀라를 찾고 있었는데, 다른 그래놀라보다 좀 덜 달고 요거트와 너무 잘 어울려서 맛있었어요.",
    profile: "/images/profiles/profile2.png",
    images: ["/images/reviews/review4.png", "/images/reviews/review5.png"] },
  { id: 3, name: "고*돈", rating: 4, date: "2026.04.08",
    product: "몰가홀푸드 비건 귀리 그래놀라 500g, 1개",
    text: "가볍고 고소해서 데일리로 먹기 좋은 그래놀라!! 다른 그래놀라보다 좀 덜 달고 요거트와 너무 잘 어울려서 맛있었어요. 배송도 안전하게 잘 포장되어 와서 좋았습니다!",
    profile: "/images/profiles/profile3.png",
    images: ["/images/reviews/review6.png", "/images/reviews/review7.png"] },
  { id: 4, name: "고*돈", rating: 4, date: "2026.04.08",
    product: "몰가홀푸드 비건 귀리 그래놀라 500g, 1개",
    text: "가볍고 고소해서 데일리로 먹기 좋은 그래놀라!! 다른 그래놀라보다 좀 덜 달고 요거트와 너무 잘 어울려서 맛있었어요. 하나만 사서 좀 아쉬운데 나중에 할인할때 여러개 사서 쟁여놓으려구요.",
    profile: "/images/profiles/profile4.png",
    images: ["/images/reviews/review1.png", "/images/reviews/review2.png"] },
];

// 상단 사진 그리드: review1~7 + 더보기
const REVIEW_GRID_IMAGES = Array.from({ length: 7 }, (_, i) => `/images/reviews/review${i + 1}.png`);

const ReviewSection: FC = () => {
  const [sort, setSort] = useState<"추천순" | "최근등록순">("추천순");
  const [page, setPage] = useState(1);

  return (
    <div className="w-full border border-[#BBBBBB]">

      {/* ── 사진 그리드 (130×130, 8장) ───────────────────────────────── */}
      <div className="p-[25px] flex gap-[10px]">
        {REVIEW_GRID_IMAGES.map((src, i) => (
          <div key={i} className="w-[130px] h-[130px] flex-shrink-0 rounded-xs overflow-hidden bg-gray-100">
            <img src={src} alt="" className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        ))}
        {/* 마지막 — review8 이미지 + 검은 투명 오버레이 + 더보기 텍스트 */}
        <div className="w-[130px] h-[130px] flex-shrink-0 rounded-xs overflow-hidden bg-gray-100 relative">
          <img src="/images/reviews/review8.png" alt="" className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-[20px] font-medium leading-[24px] tracking-[-0.025em]">+ 더보기</span>
          </div>
        </div>
      </div>

      {/* ── 총 개수 + 정렬 ─────────────────────────────────────────────── */}
      <div className="px-[25px] py-[12px] flex items-center justify-between">
        <span className="text-[16px] font-medium text-black tracking-[-0.025em]">총 1,023개</span>
        <div className="flex items-center gap-[4px] text-[16px] font-medium">
          <button
            onClick={() => setSort("추천순")}
            className={sort === "추천순" ? "text-gray-800" : "text-gray-400 hover:text-gray-600"}>
            추천순
          </button>
          <span className="text-gray-400 mx-[4px]">ㅣ</span>
          <button
            onClick={() => setSort("최근등록순")}
            className={sort === "최근등록순" ? "text-gray-800" : "text-gray-400 hover:text-gray-600"}>
            최근등록순
          </button>
        </div>
      </div>

      {/* ── 후기 목록 ──────────────────────────────────────────────────── */}
      {MOCK_REVIEWS.map((r) => (
        <div key={r.id}>
          <div className="flex gap-[12px] px-[25px] py-[24px]">

            {/* 프로필 사진 (40×40) */}
            <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <img src={r.profile} alt={r.name} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>

            {/* 우측 내용 */}
            <div className="flex-1 min-w-0">
              {/* 이름 + 별점 + 날짜 (한 줄) */}
              <div className="flex items-center gap-[8px] mb-[4px]">
                <span className="text-[16px] font-medium text-black tracking-[-0.025em]">{r.name}</span>
                <StarRow rating={r.rating} size={16} />
                <span className="text-[10px] text-gray-400 tracking-[-0.025em]">{r.date}</span>
              </div>

              {/* 구매 상품명 */}
              <p className="text-[12px] text-gray-400 tracking-[-0.025em] mb-[8px]">{r.product}</p>

              {/* 후기 텍스트 먼저 */}
              <p className="text-[12px] font-medium text-gray-800 leading-[140%] tracking-[-0.025em] mb-[10px]">{r.text}</p>

              {/* 후기 사진 텍스트 아래 (100×100) */}
              {r.images.length > 0 && (
                <div className="flex gap-[10px]">
                  {r.images.map((src, idx) => (
                    <div key={idx} className="w-[100px] h-[100px] rounded-xs overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={src} alt="" className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* 페이지네이션 */}
      <div className="pb-6">
        <Pagination current={page} total={5} onChange={setPage} />
      </div>
    </div>
  );
};

// ── 문의 섹션 ──────────────────────────────────────────────────────────────────
const MOCK_QNA = [
  { id: 1, title: "사용 기간이 어떻게 되나요?", author: "최*주", date: "2026.04.11", status: "답변완료", isSecret: false,
    q: "유통기한 임박상품이라 세일인지 궁금합니다.",
    a: "안녕하세요. 고객님들의 안전과 만족도를 최우선으로 하는 픽푸드입니다. 문의해주신 상품은 금일 주문 시 소비기한 2028-10-09 상품으로 출고되는 점 구매 시 참고 부탁드립니다. 답변드린 내용을 통해 궁금하신 사항이 해결되셨길 바라며, 앞으로도 고객님의 안전하고 신선한 먹거리를 제공하고자 최선을 다하는 픽푸드가 되겠습니다. 감사합니다." },
  { id: 2, title: "비밀글입니다.", author: "박*은", date: "2026.03.11", status: "답변완료", isSecret: true, q: "", a: "" },
  { id: 3, title: "비밀글입니다.", author: "박*은", date: "2026.03.11", status: "답변완료", isSecret: true, q: "", a: "" },
  { id: 4, title: "유통기한", author: "김*현", date: "2026.02.11", status: "답변완료", isSecret: false,
    q: "유통기한이 얼마나 남았나요?", a: "현재 재고 기준 유통기한은 약 1년 이상입니다." },
  { id: 5, title: "재입고 언제 되나요?", author: "권*서", date: "2026.02.11", status: "답변완료", isSecret: false,
    q: "재입고 예정이 있나요?", a: "빠른 시일 내에 재입고 예정입니다." },
  { id: 6, title: "비밀글입니다.", author: "박*은", date: "2026.03.11", status: "답변완료", isSecret: true, q: "", a: "" },
  { id: 7, title: "비밀글입니다.", author: "박*은", date: "2026.03.11", status: "답변완료", isSecret: true, q: "", a: "" },
  { id: 8, title: "유통기한", author: "김*현", date: "2026.02.11", status: "답변완료", isSecret: false,
    q: "유통기한 문의드립니다.", a: "최소 6개월 이상 남은 상품으로 출고됩니다." },
  { id: 9, title: "유통기한", author: "김*현", date: "2026.02.11", status: "답변완료", isSecret: false,
    q: "소비기한이 언제까지인가요?", a: "현재 출고 상품 기준 소비기한은 2027년 이후 상품입니다." },
];

const QnaSection: FC = () => {
  const [expanded, setExpanded]   = useState<number | null>(null);
  const [page, setPage]           = useState(1);
  const [secretToast, setSecretToast] = useState(false);

  function handleRowClick(item: typeof MOCK_QNA[0]) {
    if (item.isSecret) {
      setSecretToast(true);
      setTimeout(() => setSecretToast(false), 3000);
      return;
    }
    setExpanded(expanded === item.id ? null : item.id);
  }

  return (
    <div className="w-full border border-[#BBBBBB]">

        {/* 상품 문의 타이틀 + 문의하기 버튼 */}
        <div className="px-[30px] pt-[31px] pb-[10px] flex items-center justify-between">
            <h3 className="text-[30px] font-medium text-gray-900 leading-[36px] tracking-[-0.025em]">
            상품 문의
            </h3>
            <button className="w-[70px] h-[29px] border border-primary rounded-xs text-[12px] font-medium text-primary hover:bg-primary-light transition-colors flex-shrink-0">
            문의하기
            </button>
        </div>

        {/* 안내 문구 */}
        <div className="px-[30px] pb-[31px]">
            <p className="text-[12px] font-medium text-gray-400 leading-[15px] tracking-[-0.025em]">
            • 구매한 상품의 취소/반품은 마이페이지 구매내역에서 신청 가능합니다.
            </p>
            <p className="text-[12px] font-medium text-gray-400 leading-[15px] tracking-[-0.025em]">
            • 상품 문의 및 후기게시판을 통해 취소나 환불, 반품 등은 처리되지 않습니다.
            </p>
            <p className="text-[12px] font-medium text-gray-400 leading-[15px] tracking-[-0.025em]">
            • 가격, 판매자, 교환/환불 및 배송 등 해당 상품과 관련 없는 문의는 고객센터 내 1:1 문의하기를 이용해주세요.
            </p>
            <p className="text-[12px] font-medium text-gray-400 leading-[15px] tracking-[-0.025em]">
            • "해당 상품 자체"와 관계 없는 글, 양도, 광고성, 비방, 욕설, 도배 등의 글은 예고 없이 이동, 노출제한, 삭제 등의 조치가 취해질 수 있습니다.
            </p>
            <p className="text-[12px] font-medium text-gray-400 leading-[15px] tracking-[-0.025em]">
            • 공개 게시판이므로 전화번호, 메일 주소 등 고객님의 소중한 개인정보는 절대 남기지 말아주세요.
            </p>
        </div>

        {/* 헤더 — 위아래 검은 선 */}
        <div className="px-[30px]">
        <div className="border-t border-b border-gray-900">
            <div className="grid grid-cols-[1fr_80px_100px_80px] h-[54px] items-center text-[14px] font-medium text-black">
                <span className="text-center">제목</span>
                <span className="text-center">작성자</span>
                <span className="text-center">작성일</span>
                <span className="text-center">답변상태</span>
            </div>
            </div>
        </div>

        {/* 문의 목록 */}
      {MOCK_QNA.map((item) => (
        <div key={item.id} className="px-[30px]">
          {/* 행 */}
          <button
            onClick={() => handleRowClick(item)}
            className="w-full hover:bg-surface-faint transition-colors text-left border-b border-[#BBBBBB]"
          >
            <div className="grid grid-cols-[1fr_80px_100px_80px] h-[61px] items-center">
              {/* 제목 */}
              <div className="flex items-center gap-[8px] text-[14px] font-medium text-gray-600 tracking-[-0.025em] leading-[140%]">
                {item.isSecret ? (
                  <>
                    <span className="text-[#BBBBBB]">비밀글입니다.</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BBBBBB" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </>
                ) : item.title}
              </div>
              {/* 작성자 */}
              <span className="text-center text-[14px] font-medium text-[#AAAAAA] leading-[140%]">
                {item.author}
              </span>
              {/* 작성일 */}
              <span className="text-center text-[14px] font-medium text-[#AAAAAA] leading-[140%]">
                {item.date}
              </span>
              {/* 답변상태 */}
              <span className="text-center text-[14px] font-medium text-primary leading-[140%]">
                {item.status}
              </span>
            </div>
          </button>
 
          {/* 펼침 — Q&A */}
          {expanded === item.id && !item.isSecret && (
            <div className="bg-surface-faint py-[20px] border-b border-[#BBBBBB]">
              <div className="flex gap-[12px] mb-[16px]">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[12px] font-medium text-white">Q</span>
                </div>
                <p className="text-[12px] font-medium text-gray-600 leading-[140%]">{item.q}</p>
              </div>
              <div className="flex gap-[12px]">
                <div className="w-5 h-5 rounded-full bg-primary-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[12px] font-medium text-white">A</span>
                </div>
                <p className="text-[12px] font-medium text-gray-600 leading-[140%]">{item.a}</p>
              </div>
            </div>
          )}
        </div>
      ))}
 
      {/* 페이지네이션 */}
      <div className="py-[20px]">
        <Pagination current={page} total={5} onChange={setPage} />
      </div>
 
      {/* 비밀글 토스트 */}
      {secretToast && (
        <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 z-50 w-[400px] h-[40px] flex items-center justify-between px-[14px] bg-gray-800 border border-black rounded-xs">
          <span className="text-[12px] font-semibold text-primary-light">비밀글 입니다.</span>
          <button onClick={() => setSecretToast(false)} className="text-[12px] font-semibold text-warn-border">확인</button>
        </div>
      )}
    </div>
  );
};

// ── 탭 목록 ───────────────────────────────────────────────────────────────────
const TAB_LIST = [
  { id: "desc",   label: "상품설명" },
  { id: "detail", label: "상세정보" },
  { id: "review", label: "후기" },
  { id: "qna",    label: "문의" },
] as const;
type TabId = typeof TAB_LIST[number]["id"];

// ── ProductDetailPage ─────────────────────────────────────────────────────────
const ProductDetailPage: FC<ProductDetailPageProps> = ({ product, onBack }) => {
  const { quantity, increment, decrement, isHearted, toggleHeart, isCarted, toggleCart, activeTab, setActiveTab, totalPrice } = useProductDetail(product);
  const { toast, showToast } = useToast();

  // 탭바 ref (sticky 기준)
  const tabBarRef = useRef<HTMLDivElement | null>(null);
  // 각 섹션 ref
  const descRef   = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const qnaRef    = useRef<HTMLDivElement | null>(null);

  const refMap: Record<TabId, React.RefObject<HTMLDivElement | null>> = {
    desc: descRef, detail: detailRef, review: reviewRef, qna: qnaRef,
  };

  // TopBar 높이 동적 측정 (sticky top 계산용)
  const [headerHeight, setHeaderHeight] = useState(100);
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    setHeaderHeight(header.getBoundingClientRect().height);
    const observer = new ResizeObserver(() => setHeaderHeight(header.getBoundingClientRect().height));
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  function handleTabClick(id: TabId) {
    setActiveTab(id);
    const el = refMap[id].current;
    const tabBar = tabBarRef.current;
    if (!el) return;
    const tabBarBottom = tabBar ? tabBar.getBoundingClientRect().bottom : 0;
    const elTop = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elTop - tabBarBottom - 8, behavior: "smooth" });
  }

  function handleHeart() { const next = !isHearted; toggleHeart(); showToast(next ? "heart" : "heartCancel"); }
  function handleCart()  { const next = !isCarted;  toggleCart();  showToast(next ? "cart"  : "cartCancel");  }

  const fullStars  = Math.floor(product.rating);
  const emptyStars = 5 - fullStars;
  const descImageSrc   = `/images/detail/product-${product.id}-desc.png`;
  const detailImageSrc = `/images/detail/product-${product.id}-detail.png`;

  return (
    <>
      <div className="bg-white">
        <div className="max-w-[1200px] mx-auto px-4 pt-6">

          {/* 뒤로가기 */}
          {onBack && (
            <button onClick={onBack} className="mb-4 text-[13px] font-medium text-gray-400 hover:text-primary flex items-center gap-1">
              ← 목록으로
            </button>
          )}

          {/* ── 상품 정보 (고정 — 전체 노출) ─────────────────────────────── */}
          <div className="flex gap-8 mb-6">

            {/* 상품 이미지 */}
            <div className="w-[560px] h-[400px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <img src={product.imageSrc} alt={product.name} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>

            {/* 우측 정보 */}
            <div className="flex-1 flex flex-col">

              {/* 브랜드 */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-[44px] h-[44px] rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                  <img src="/images/mall/mall.png" alt={product.brand} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-gray-800">{product.brand}</p>
                  <p className="text-[11px] font-medium text-gray-300">브랜드샵 →</p>
                </div>
                <button className="ml-auto text-gray-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
                  </svg>
                </button>
              </div>

              <p className="text-[13px] text-gray-300 mb-1">원산지 : 상품 상세설명 참조</p>
              <h1 className="text-[22px] font-medium text-gray-900 leading-[140%] mb-1">{product.name}</h1>

              {/* 별점 */}
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: fullStars  }).map((_, i) => (
                  <svg key={`f${i}`} width="18" height="18" viewBox="0 0 24 24" fill="#FEE500">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
                {Array.from({ length: emptyStars }).map((_, i) => (
                  <svg key={`e${i}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="1.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
                <span className="text-[11px] text-gray-400 ml-1">{product.rating}</span>
                <span className="text-[11px] text-gray-400">|</span>
                <span className="text-[11px] text-gray-400">{product.reviewCount} 상품평</span>
              </div>

              {/* 가격 */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[14px] font-semibold text-primary-red">{product.discountRate}%</span>
                <span className="text-[14px] font-semibold text-gray-300 line-through">{product.originalPrice.toLocaleString()}원</span>
                <span className="text-[20px] font-semibold text-gray-800">{product.price.toLocaleString()}원</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[14px] font-semibold text-primary">30%</span>
                <span className="text-[14px] font-semibold text-gray-300 line-through">{product.originalPrice.toLocaleString()}원</span>
                <span className="text-[20px] font-semibold text-primary">{Math.round(product.price * 0.7).toLocaleString()}원</span>
                <span className="text-[10px] text-primary ml-1">첫구매 최대 혜택가</span>
              </div>

              {/* 쿠폰 배너 */}
              <div className="w-full h-[30px] flex items-center gap-2 px-3 bg-primary-light border border-primary rounded-xs mb-3">
                <img src={couponIcon} alt="" className="w-4 h-4 flex-shrink-0" />
                <span className="text-[11px] font-medium text-black flex-1">
                  첫 구매라면 {Math.round(product.price * 0.7).toLocaleString()}원에 구매, 무료배송까지
                </span>
                <span className="text-[11px] text-gray-800">→</span>
              </div>

              <InfoRow label="배송" sub="23시 전 주문시 수도권/충청 내일 오전 10시 전 도착">당일배송(24시간)</InfoRow>
              <InfoRow label="배송지역">전국(도서산간지역 추가 비용 발생)</InfoRow>
              <InfoRow label="배송비" sub="첫 구매 회원 or 3만원 이상 무료배송">3,000원</InfoRow>
              <InfoRow label="보관 방법">상온 (종이포장)</InfoRow>
              <InfoRow label="중량">500g</InfoRow>
              <InfoRow label="알레르기 정보">- 대두, 밀 포함</InfoRow>

              {/* 상품 선택 */}
              <Divider />
              <div className="py-[8px]">
                <p className="text-[12px] font-medium text-gray-600 mb-2">상품 선택</p>
                <div className="w-full border border-[#BBBBBB] rounded-xs p-3">
                  <p className="text-[11px] text-gray-400 mb-2">{product.name}</p>
                  <div className="flex items-center bg-[#F0F0F0] rounded-[10px] overflow-hidden w-fit">
                    <button onClick={decrement} className="w-[28px] h-[20px] flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7" stroke="#999999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                    <span className="text-[12px] font-medium text-gray-800 w-[16px] text-center">{quantity}</span>
                    <button onClick={increment} className="w-[28px] h-[20px] flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2.5v7M2.5 6h7" stroke="#333333" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* 총 상품금액 */}
              <Divider />
              <div className="flex items-baseline justify-end gap-2 py-2">
                <span className="text-[12px] font-medium text-gray-600">총 상품금액:</span>
                <span className="text-[26px] font-semibold text-gray-800">{totalPrice.toLocaleString()}</span>
                <span className="text-[26px] font-medium text-gray-800">원</span>
              </div>

              {/* 액션 버튼 */}
              <div className="flex items-center gap-2">
                <button onClick={handleHeart}
                  className="w-[40px] h-[40px] border border-[#BBBBBB] rounded-sm flex items-center justify-center hover:border-primary transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                      fill={isHearted ? "#FF0000" : "none"} stroke={isHearted ? "#FF0000" : "#BBBBBB"} strokeWidth="1.5" />
                  </svg>
                </button>
                <button onClick={handleCart}
                  className="w-[40px] h-[40px] border border-[#BBBBBB] rounded-sm flex items-center justify-center hover:border-primary transition-colors">
                  <img src={cartIcon} alt="" className={`w-5 h-5 ${isCarted ? "[filter:invert(25%)_sepia(80%)_saturate(500%)_hue-rotate(340deg)_brightness(80%)]" : ""}`} />
                </button>
                <button onClick={handleCart}
                  className="flex-1 h-[40px] border border-primary rounded-base text-[13px] font-medium text-primary hover:bg-primary-light transition-colors">
                  장바구니 담기
                </button>
                <button className="flex-1 h-[40px] bg-primary rounded-base text-[13px] font-medium text-white hover:bg-primary-dark transition-colors">
                  바로 결제하기
                </button>
              </div>
            </div>
          </div>

          {/* ── sticky 탭바 ────────────────────────────────────────────────── */}
          <div
            ref={tabBarRef}
            style={{ top: headerHeight }}
            className="sticky z-30 flex border border-[#BBBBBB] bg-white"
          >
            {TAB_LIST.map((tab) => (
              <button key={tab.id} onClick={() => handleTabClick(tab.id)}
                className={["flex-1 h-[44px] text-[15px] font-medium border-r border-[#BBBBBB] last:border-r-0 transition-colors",
                  activeTab === tab.id
                    ? "bg-white text-primary border-b-2 border-b-primary"
                    : "bg-surface-faint text-gray-600 hover:text-primary",
                ].join(" ")}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── 내부 스크롤 구간 (min-h 1200px) ────────────────────────────── */}
          <div>
            <div className="flex flex-col gap-8 pt-6 pb-6">

              <section ref={descRef}>
                <img src={descImageSrc} alt={`${product.name} 상품 설명`} className="w-full"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </section>

              <section ref={detailRef}>
                <img src={detailImageSrc} alt={`${product.name} 상세 정보`} className="w-full"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </section>

              <section ref={reviewRef}>
                <ReviewSection />
              </section>

              <section ref={qnaRef}>
                <QnaSection />
              </section>

            </div>
          </div>

        </div>
      </div>

      <Toast toast={toast} onNavigate={() => {}} />
    </>
  );
};

export default ProductDetailPage;