/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ADMIN_PASSWORD?: string;
  /** 배포 URL (OG·canonical). 예: https://your-site.vercel.app */
  readonly VITE_SITE_URL?: string;
  /** false·0·no 이면 noindex (스테이징). 미설정 시 검색 허용 */
  readonly VITE_ALLOW_INDEXING?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
