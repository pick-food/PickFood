// 백엔드 /auth/signup의 name 필드가 한글을 거부하는 버그 때문에, 한글 이름은
// 로마자로 변환해 서버로 보내고(가입은 통과), 원래 한글 이름은 로컬에 저장해
// 화면에서는 항상 한글로 보여준다.

const CHO  = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const JUNG = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const JONG = ['','k','k','k','n','n','n','t','l','k','m','l','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t'];

function romanizeSyllable(code: number): string {
  const offset = code - 0xAC00;
  const cho  = CHO[Math.floor(offset / (21 * 28))];
  const jung = JUNG[Math.floor((offset % (21 * 28)) / 28)];
  const jong = JONG[offset % 28];
  return cho + jung + jong;
}

export function romanizeKoreanName(input: string): string {
  let result = "";
  for (const ch of input) {
    const code = ch.codePointAt(0)!;
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const syl = romanizeSyllable(code);
      result += syl.charAt(0).toUpperCase() + syl.slice(1);
    } else if (/[A-Za-z]/.test(ch)) {
      result += ch;
    }
  }
  return result || "User";
}

export function hasHangul(input: string): boolean {
  return /[가-힣]/.test(input);
}

const STORAGE_PREFIX = "pickfood:display_name:";

export function saveLocalDisplayName(userId: string, originalName: string): void {
  localStorage.setItem(STORAGE_PREFIX + userId, originalName);
}

export function getLocalDisplayName(userId: string): string | null {
  return localStorage.getItem(STORAGE_PREFIX + userId);
}
