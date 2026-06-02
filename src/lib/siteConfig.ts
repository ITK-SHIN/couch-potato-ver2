/** 배포 도메인 (OG canonical). 미설정 시 브라우저 origin 사용 */
export function getSiteUrl(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

/** false·0 이면 noindex. 미설정 시 검색 허용(운영 기본) */
export function allowSearchIndexing(): boolean {
  const flag = import.meta.env.VITE_ALLOW_INDEXING?.trim().toLowerCase();
  if (flag === "false" || flag === "0" || flag === "no") return false;
  return true;
}

export const DEFAULT_SITE_NAME = "코치포테이토";

/** public/ 브랜드 로고 (네비·히어로) */
export const BRAND_LOGO_SRC = "/카우치포테이토로고.png";
