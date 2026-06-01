import type { SiteContent } from "../types/siteContent";

export function isSiteContentDirty(
  published: SiteContent,
  draft: SiteContent
): boolean {
  return JSON.stringify(published) !== JSON.stringify(draft);
}
