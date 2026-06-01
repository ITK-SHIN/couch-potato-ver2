import { defaultSiteContent } from "../data/defaultSiteContent";
import type { SiteContent } from "../types/siteContent";

export function mergeSiteContent(partial: Partial<SiteContent> | null): SiteContent {
  if (!partial) return defaultSiteContent;
  return {
    hero: { ...defaultSiteContent.hero, ...partial.hero },
    highlights: partial.highlights ?? defaultSiteContent.highlights,
    about: { ...defaultSiteContent.about, ...partial.about },
    services: {
      ...defaultSiteContent.services,
      ...partial.services,
      cta: {
        ...defaultSiteContent.services.cta,
        ...partial.services?.cta,
      },
      items: partial.services?.items ?? defaultSiteContent.services.items,
    },
    process: {
      ...defaultSiteContent.process,
      ...partial.process,
      steps: partial.process?.steps ?? defaultSiteContent.process.steps,
    },
    portfolio: {
      ...defaultSiteContent.portfolio,
      ...partial.portfolio,
      items: partial.portfolio?.items ?? defaultSiteContent.portfolio.items,
      categories:
        partial.portfolio?.categories ?? defaultSiteContent.portfolio.categories,
    },
    contact: { ...defaultSiteContent.contact, ...partial.contact },
    footer: { ...defaultSiteContent.footer, ...partial.footer },
  };
}
