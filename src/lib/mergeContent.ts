import { defaultSiteContent } from "../data/defaultSiteContent";
import type { PortfolioItem, ProcessStep, SiteContent } from "../types/siteContent";

function normalizeProcessStep(step: ProcessStep): ProcessStep {
  return {
    ...step,
    imageFit: step.imageFit ?? "cover",
  };
}

function normalizePortfolioItem(item: PortfolioItem): PortfolioItem {
  return {
    ...item,
    videoType: item.videoType ?? "none",
    youtubeUrl: item.youtubeUrl ?? "",
    videoUrl: item.videoUrl ?? "",
  };
}

export function mergeSiteContent(partial: Partial<SiteContent> | null): SiteContent {
  if (!partial) return defaultSiteContent;
  return {
    ...(partial.seo ? { seo: partial.seo } : {}),
    hero: { ...defaultSiteContent.hero, ...partial.hero },
    highlights: partial.highlights ?? defaultSiteContent.highlights,
    about: {
      ...defaultSiteContent.about,
      ...partial.about,
      imageFit: partial.about?.imageFit ?? "contain",
    },
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
      steps: (partial.process?.steps ?? defaultSiteContent.process.steps).map(
        normalizeProcessStep
      ),
    },
    portfolio: {
      ...defaultSiteContent.portfolio,
      ...partial.portfolio,
      items: (partial.portfolio?.items ?? defaultSiteContent.portfolio.items).map(
        normalizePortfolioItem
      ),
      categories:
        partial.portfolio?.categories ?? defaultSiteContent.portfolio.categories,
    },
    contact: { ...defaultSiteContent.contact, ...partial.contact },
    footer: { ...defaultSiteContent.footer, ...partial.footer },
  };
}
