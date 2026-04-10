export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export const SUPPORT_LINKS: FooterLink[] = [
  { label: '자주 묻는 질문', href: '/faq' },
  { label: '1:1 고객 문의',  href: '/inquiry' },
  { label: '공지사항',       href: '/notice' },
];

export const BOTTOM_LINKS: FooterLink[] = [
  { label: '서비스소개',       href: '/about' },
  { label: '이용약관',         href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
];

export const CONTACT_INFO = [
  { label: '0000-0000' },
  { label: '평일 09:00 - 18:00 / 주말 X' },
  { label: '점심시간 12:00 - 13:00' },
] as const;

// 추후 개발: 주석 풀고 아이콘/URL 채우면 바로 렌더링됨
export const SOCIAL_LINKS: SocialLink[] = [
  // { name: 'Instagram', href: 'https://instagram.com/pickfood', icon: '/assets/icons/instagram.png' },
  // { name: 'YouTube',   href: 'https://youtube.com/pickfood',   icon: '/assets/icons/youtube.png' },
];