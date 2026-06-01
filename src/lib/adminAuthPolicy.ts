import { isSupabaseConfigured } from "./supabase";

/** 로컬 비밀번호 로그인: 개발 환경 + Supabase 미연결 시만 */
export function canUseLocalPasswordAuth(): boolean {
  return import.meta.env.DEV && !isSupabaseConfigured;
}

/** 프로덕션 배포인데 Supabase 미설정 */
export function isProductionWithoutSupabase(): boolean {
  return import.meta.env.PROD && !isSupabaseConfigured;
}
