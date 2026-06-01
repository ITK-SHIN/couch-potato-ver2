import type {
  PortfolioItem,
  SiteContent,
  SiteSeoFields,
} from "../types/siteContent";

export function patchSeo(
  prev: SiteContent,
  patch: Partial<SiteSeoFields>
): SiteContent {
  return { ...prev, seo: { ...prev.seo, ...patch } };
}

export function patchHero(
  prev: SiteContent,
  patch: Partial<SiteContent["hero"]>
): SiteContent {
  return { ...prev, hero: { ...prev.hero, ...patch } };
}

export function patchAbout(
  prev: SiteContent,
  patch: Partial<SiteContent["about"]>
): SiteContent {
  return { ...prev, about: { ...prev.about, ...patch } };
}

export function patchServices(
  prev: SiteContent,
  patch: Partial<Pick<SiteContent["services"], "title" | "subtitle">>
): SiteContent {
  return { ...prev, services: { ...prev.services, ...patch } };
}

export function patchServicesCta(
  prev: SiteContent,
  patch: Partial<SiteContent["services"]["cta"]>
): SiteContent {
  return {
    ...prev,
    services: {
      ...prev.services,
      cta: { ...prev.services.cta, ...patch },
    },
  };
}

export function patchProcess(
  prev: SiteContent,
  patch: Partial<Pick<SiteContent["process"], "title" | "subtitle">>
): SiteContent {
  return { ...prev, process: { ...prev.process, ...patch } };
}

export function patchPortfolio(
  prev: SiteContent,
  patch: Partial<SiteContent["portfolio"]>
): SiteContent {
  return { ...prev, portfolio: { ...prev.portfolio, ...patch } };
}

export function appendPortfolioItems(
  prev: SiteContent,
  newItems: PortfolioItem[]
): SiteContent {
  return patchPortfolio(prev, {
    items: [...prev.portfolio.items, ...newItems],
  });
}

export function patchContact(
  prev: SiteContent,
  patch: Partial<SiteContent["contact"]>
): SiteContent {
  return { ...prev, contact: { ...prev.contact, ...patch } };
}

export function patchFooter(
  prev: SiteContent,
  patch: Partial<SiteContent["footer"]>
): SiteContent {
  return { ...prev, footer: { ...prev.footer, ...patch } };
}
