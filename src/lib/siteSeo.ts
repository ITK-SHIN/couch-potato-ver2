import type { SiteContent } from "../types/siteContent";
import { DEFAULT_SITE_NAME } from "./siteConfig";

export type ResolvedSeoMeta = {
  siteName: string;
  title: string;
  description: string;
  ogImage: string;
  keywords: string;
};

export function resolveSeoMeta(content: SiteContent): ResolvedSeoMeta {
  const seo = content.seo;
  const siteName = seo?.siteName?.trim() || content.hero.title?.trim() || DEFAULT_SITE_NAME;
  const title =
    seo?.title?.trim() ||
    `${siteName} | ${content.hero.subtitle?.trim() || "영상 제작 스튜디오"}`;
  const description =
    seo?.description?.trim() ||
    content.hero.description?.trim() ||
    "기획부터 촬영, 편집까지 — 브랜드 영상 제작 파트너 코치포테이토";
  const ogImage = seo?.ogImage?.trim() || content.hero.backgroundImage?.trim() || "";
  const keywords =
    seo?.keywords?.trim() ||
    "영상제작,브랜드영상,유튜브,콘텐츠제작,코치포테이토,COUCHPOTATO";

  return { siteName, title, description, ogImage, keywords };
}
