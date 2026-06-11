import logo from '/logo.svg';

const COLS = [
  { title: '고객지원',   items: ['공지사항', '자주 묻는 질문', '1:1 문의', '반품·교환'] },
  { title: '회사정보',   items: ['회사 소개', '채용 안내', '보도자료', '파트너십'] },
  { title: '안전 기준',  items: ['알레르기 검증 절차', '안전 자문 위원회', 'HACCP 인증', '원재료 추적'] },
  { title: '입점·제휴',  items: ['브랜드 입점', 'PB 파트너', '광고 제휴', 'API 제휴'] },
];

const SocialDot = ({ label }: { label: string }) => (
  <div style={{ width: 30, height: 30, borderRadius: 999, background: '#1A2A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#A0B0A6', cursor: 'pointer' }}>
    {label}
  </div>
);

export function Footer() {
  return (
    <footer style={{ background: '#0F1E12', color: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 32px' }}>

        {/* 5열 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>

          {/* 브랜드 컬럼 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <img src={logo} alt="PickFood" style={{ height: 32, width: 'auto', filter: 'brightness(0) invert(1)' }} />
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', color: '#A8E063' }}>pickfood</span>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: '#A0B0A6' }}>
              알레르기·질병이 있는 가족을 위한<br />
              맞춤 식품 쇼핑 플랫폼.<br />
              매일 안전한 식품을 배달합니다.
            </p>
            <div style={{ display: 'flex', gap: 6, marginTop: 18 }}>
              {['HACCP', 'KFDA', 'ISO 22000', 'KISA'].map(c => (
                <span key={c} style={{ padding: '4px 8px', border: '1px solid #2A3A2F', borderRadius: 4, fontSize: 10, fontWeight: 700, color: '#A0B0A6' }}>{c}</span>
              ))}
            </div>
          </div>

          {/* 링크 컬럼들 */}
          {COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14, color: '#fff' }}>{col.title}</div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
                {col.items.map(it => (
                  <li key={it} style={{ fontSize: 12, color: '#A0B0A6', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#A0B0A6')}
                  >{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 하단 */}
        <div style={{ borderTop: '1px solid #2A3A2F', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 11, color: '#6B8070', lineHeight: 1.8 }}>
            (주)픽푸  ·  대표 박희은  ·  사업자등록번호 123-45-67890  ·  통신판매업신고 2026-서울강남-01234<br />
            서울특별시 강남구 테헤란로 123, 픽푸빌딩 8층  ·  고객센터 1588-0000 (평일 09:00~18:00)<br />
            © 2026 pickfood Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <SocialDot label="IG" />
            <SocialDot label="YT" />
            <SocialDot label="BL" />
            <SocialDot label="KK" />
          </div>
        </div>
      </div>
    </footer>
  );
}
