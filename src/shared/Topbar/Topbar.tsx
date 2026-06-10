import { useState, useEffect, useRef } from 'react';
import logo from '/logo.svg';
import { useTopBar } from './hooks/useTopBar';
import { NavBar }     from './components/NavBar';
import { useAuth }    from '../../features/auth/store/useAuth';
import { useMyAllergenSummary } from '../../features/allergen/hooks/useMyAllergenSummary';
import NotificationPanel from '../../features/notification/components/NotificationPanel';
import { PF_CURRENT_USER } from '../../data/pfData';

interface TopBarProps {
  onSearch?:       (query: string) => void;
  onLogin?:        () => void;
  onSignup?:       () => void;
  onSupport?:      () => void;
  onMyPage?:       () => void;
  isLoginActive?:  boolean;
  isSignupActive?: boolean;
  isLoggedIn:      boolean;
  activeNavTab:    string | null;
  onNavTabChange:  (id: string) => void;
}

/* ── 알림 · 장바구니 뱃지 ──────────────────────────────── */
const BadgeBtn = ({
  icon,
  label,
  badge,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: number | null;
  onClick?: () => void;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    style={{
      position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
      background: active ? '#F0F2EC' : 'transparent', border: 'none', cursor: 'pointer',
      padding: '6px 10px', borderRadius: 8, minWidth: 52,
      transition: 'background 160ms',
    }}
  >
    {icon}
    <span style={{ fontSize: 10, color: '#6B7A6E', fontWeight: 600, marginTop: 2 }}>{label}</span>
    {badge != null && badge > 0 && (
      <span style={{
        position: 'absolute', top: 2, right: 4,
        background: '#D32F2F', color: '#fff', borderRadius: 999,
        fontSize: 10, fontWeight: 800, padding: '1px 5px', minWidth: 16, textAlign: 'center', lineHeight: 1.3,
      }}>{badge}</span>
    )}
  </button>
);

/* ── SVG Icons (인라인) ─────────────────────────────────── */
const SearchIco   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#0F1E12" strokeWidth="2"/><path d="M21 21L16.65 16.65" stroke="#0F1E12" strokeWidth="2" strokeLinecap="round"/></svg>;
const BellIco     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#3A4A3F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const HeartIco    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="#3A4A3F" strokeWidth="1.8"/></svg>;
const CartIco     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#3A4A3F" strokeWidth="1.8" strokeLinejoin="round"/><line x1="3" y1="6" x2="21" y2="6" stroke="#3A4A3F" strokeWidth="1.8"/><path d="M16 10a4 4 0 01-8 0" stroke="#3A4A3F" strokeWidth="1.8"/></svg>;
const UserIco     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#9AA89D" strokeWidth="1.8"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="#9AA89D" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const ShieldIco   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#A8E063" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#A8E063" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ChevRightIco = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#A8E063" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const TRENDING = ['저당 식품', '알레르기 인증', '글루텐프리', '수제 볶음밥', '단백질 보충'];

export function TopBar({
  onSearch,
  onLogin,
  onSignup,
  onMyPage,
  isLoginActive: _isLoginActive,
  isSignupActive: _isSignupActive,
  isLoggedIn,
  activeNavTab,
  onNavTabChange,
}: TopBarProps) {
  const { logout } = useAuth();
  const { allergenNames, diseaseNames } = useMyAllergenSummary();
  const { search: _search, filter: _filter, tabs } = useTopBar(onSearch);
  const [q, setQ] = useState('');
  const menuRef       = useRef<HTMLDivElement>(null);
  const notifRef      = useRef<HTMLDivElement>(null);
  const [showMyMenu,       setShowMyMenu]       = useState(false);
  const [showNotifPanel,   setShowNotifPanel]   = useState(false);
  const [unreadCount,      setUnreadCount]      = useState<number | null>(null);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMyMenu(false);
    }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  const utilLinks = [
    { label: '고객센터' },
    { label: '입점 문의' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 60, background: '#fff' }}>

      {/* ── Row 1: 유틸리티 바 ──────────────────────────────── */}
      <div style={{ borderBottom: '1px solid #F0F2EC', background: '#FAFAF6' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '6px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: 14, fontSize: 12, color: '#6B7A6E',
        }}>
          {utilLinks.map((l, i) => (
            <span key={l.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              {i > 0 && <span style={{ width: 1, height: 10, background: '#E5E7E1' }} />}
              <a style={{ cursor: 'pointer' }}>{l.label}</a>
            </span>
          ))}
          <span style={{ width: 1, height: 10, background: '#E5E7E1' }} />
          {isLoggedIn ? (
            <a onClick={() => logout()} style={{ cursor: 'pointer', color: '#1F4D2C', fontWeight: 600 }}>로그아웃</a>
          ) : (
            <a onClick={onLogin} style={{ cursor: 'pointer', color: '#1F4D2C', fontWeight: 600 }}>로그인</a>
          )}
        </div>
      </div>

      {/* ── Row 2: 메인 헤더 ──────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid #E5E7E1', background: '#fff' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '14px 40px',
          display: 'flex', alignItems: 'center', gap: 28,
        }}>
          {/* 로고 */}
          <a onClick={() => onNavTabChange('all')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <img src={logo} alt="PickFood" style={{ height: 38, width: 'auto' }} />
          </a>

          {/* 내비게이션 */}
          <nav style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* 카테고리 */}
            <button
              onClick={() => onNavTabChange('product')}
              style={{
                fontFamily: 'inherit', fontSize: 15,
                fontWeight: activeNavTab === 'product' ? 800 : 600,
                color: activeNavTab === 'product' ? '#0F1E12' : '#3A4A3F',
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '8px 12px', borderRadius: 8, transition: 'color 160ms',
              }}
            >카테고리</button>

            {/* 조리법 */}
            <button
              onClick={() => onNavTabChange('recipe')}
              style={{
                fontFamily: 'inherit', fontSize: 15,
                fontWeight: activeNavTab === 'recipe' ? 800 : 600,
                color: activeNavTab === 'recipe' ? '#0F1E12' : '#3A4A3F',
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '8px 12px', borderRadius: 8, transition: 'color 160ms',
              }}
            >조리법</button>

            {/* AI 상담 */}
            <button
              onClick={() => onNavTabChange('ai')}
              style={{
                fontFamily: 'inherit', fontSize: 15,
                fontWeight: activeNavTab === 'ai' ? 800 : 600,
                color: activeNavTab === 'ai' ? '#0F1E12' : '#3A4A3F',
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '8px 12px', borderRadius: 8, position: 'relative', transition: 'color 160ms',
              }}
            >
              AI 상담
              <span style={{
                position: 'absolute', top: -6, right: -4,
                background: '#A8E063', color: '#0F1E12',
                fontSize: 9, fontWeight: 800, padding: '1px 4px', borderRadius: 3, lineHeight: 1.4,
              }}>NEW</span>
            </button>
          </nav>

          {/* 검색창 */}
          <div style={{ flex: 1, position: 'relative', maxWidth: 560 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 999,
              border: '2px solid #0F1E12', background: '#fff',
            }}>
              <SearchIco />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && onSearch) onSearch(q); }}
                placeholder="수제 볶음밥, 저당 빵, 글루텐프리…"
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontFamily: 'inherit', fontSize: 14, background: 'transparent', color: '#0F1E12',
                }}
              />
              <button
                onClick={() => onSearch?.(q)}
                style={{
                  background: '#0F1E12', color: '#A8E063', border: 'none', borderRadius: 999,
                  padding: '5px 12px', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}
              >검색</button>
            </div>
            {q.length === 0 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 8, paddingLeft: 4, alignItems: 'center', fontSize: 11 }}>
                <span style={{ color: '#9AA89D', fontWeight: 600 }}>인기 검색</span>
                {TRENDING.map((k, i) => (
                  <a key={k} style={{ cursor: 'pointer', color: '#3A4A3F', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ color: i < 3 ? '#D32F2F' : '#9AA89D', fontWeight: 700 }}>{i + 1}</span>
                    {k}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* 액션 아이콘들 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* 알림 — 클릭 시 패널 토글 */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <BadgeBtn
                icon={<BellIco />}
                label="알림"
                badge={isLoggedIn ? (unreadCount ?? null) : null}
                active={showNotifPanel}
                onClick={() => {
                  if (!isLoggedIn) { onLogin?.(); return; }
                  setShowNotifPanel(v => !v);
                }}
              />
              {showNotifPanel && (
                <NotificationPanel
                  containerRef={notifRef}
                  onClose={() => setShowNotifPanel(false)}
                  onUnreadCountChange={setUnreadCount}
                />
              )}
            </div>
            <BadgeBtn icon={<HeartIco />} label="찜"      badge={isLoggedIn ? 0 : null} onClick={() => onNavTabChange('product')} />
            <BadgeBtn icon={<CartIco />}  label="장바구니" badge={isLoggedIn ? 0 : null} onClick={() => onNavTabChange('product')} />

            {/* 마이페이지 */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => isLoggedIn ? setShowMyMenu(v => !v) : onLogin?.()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '6px 8px 6px 10px', borderRadius: 999, marginLeft: 4,
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 999,
                  background: isLoggedIn ? 'linear-gradient(135deg, #1F4D2C, #2E8B57)' : '#E5E7E1',
                  color: isLoggedIn ? '#A8E063' : '#9AA89D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 12,
                }}>
                  {isLoggedIn ? PF_CURRENT_USER.name.charAt(0) : <UserIco />}
                </div>
              </button>
              {showMyMenu && isLoggedIn && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 130, background: '#fff', borderRadius: 12,
                  border: '1px solid #E5E7E1', boxShadow: '0 8px 24px rgba(15,30,18,0.12)',
                  overflow: 'hidden', zIndex: 70,
                }}>
                  <button onClick={() => { onMyPage?.(); setShowMyMenu(false); }} style={{ width: '100%', padding: '12px 14px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: '#0F1E12', fontFamily: 'inherit' }}>마이페이지</button>
                  <button onClick={() => { logout(); setShowMyMenu(false); }} style={{ width: '100%', padding: '12px 14px', textAlign: 'left', background: 'transparent', borderTop: '1px solid #F0F2EC', border: 'none', cursor: 'pointer', fontSize: 13, color: '#D32F2F', fontFamily: 'inherit' }}>로그아웃</button>
                </div>
              )}
            </div>

            {!isLoggedIn && (
              <button
                onClick={onSignup}
                style={{
                  background: '#0F1E12', color: '#A8E063', border: 'none', borderRadius: 8,
                  padding: '8px 16px', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginLeft: 4,
                }}
              >회원가입</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 3: 안전 필터 바 (로그인 시만) ──────────────── */}
      {isLoggedIn && (
        <div style={{ background: '#0F1E12', color: '#fff' }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto', padding: '8px 40px',
            display: 'flex', alignItems: 'center', gap: 12, fontSize: 12,
          }}>
            <ShieldIco />
            <span style={{ color: '#A8E063', fontWeight: 700 }}>안전 필터 ON</span>
            <span style={{ color: '#5A6F60' }}>·</span>
            <span style={{ color: '#DCE9DF' }}>
              {PF_CURRENT_USER.name}님 / {allergenNames.length > 0 ? allergenNames.join('·') : '알레르기 없음'}
              {diseaseNames.length > 0 && ` / ${diseaseNames.join('·')} 케어`} 적용 중
            </span>
            <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, color: '#A8E063', cursor: 'pointer', fontWeight: 600 }}>
              필터 관리 <ChevRightIco />
            </div>
          </div>
        </div>
      )}

      {/* ── Row 4: 카테고리 탭 (항상 표시) ────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7E1' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <NavBar tabs={tabs} activeTab={activeNavTab} onTabChange={onNavTabChange} />
        </div>
      </div>

    </header>
  );
}
