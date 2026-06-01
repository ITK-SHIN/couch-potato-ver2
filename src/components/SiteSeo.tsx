import { useEffect } from "react";
import type { SiteContent } from "../types/siteContent";
import { allowSearchIndexing, getSiteUrl } from "../lib/siteConfig";
import { resolveSeoMeta } from "../lib/siteSeo";

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string
) {
  if (!content) return;
  const selector = `meta[${attribute}="${key}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

/** 공개 사이트 document 메타 (CMS 발행 콘텐츠 기준) */
export function SiteSeo({ content }: { content: SiteContent }) {
  useEffect(() => {
    const meta = resolveSeoMeta(content);
    const siteUrl = getSiteUrl();
    const canonical = siteUrl ? `${siteUrl}/` : "";
    const indexable = allowSearchIndexing();

    document.documentElement.lang = "ko";
    document.title = meta.title;

    upsertMeta("name", "description", meta.description);
    upsertMeta("name", "keywords", meta.keywords);
    upsertMeta(
      "name",
      "robots",
      indexable ? "index, follow, max-image-preview:large" : "noindex, nofollow"
    );

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", "ko_KR");
    upsertMeta("property", "og:site_name", meta.siteName);
    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", meta.description);
    if (meta.ogImage) upsertMeta("property", "og:image", meta.ogImage);
    if (canonical) upsertMeta("property", "og:url", canonical);

    upsertMeta("name", "twitter:card", meta.ogImage ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", meta.description);
    if (meta.ogImage) upsertMeta("name", "twitter:image", meta.ogImage);

    if (canonical) upsertLink("canonical", canonical);
  }, [content]);

  return null;
}
