export type ServiceIconKey =
  | "film"
  | "calendar"
  | "smartphone"
  | "users"
  | "youtube";

export interface HighlightItem {
  num: string;
  title: string;
  desc: string;
  img: string;
}

export interface ServiceItem {
  icon: ServiceIconKey;
  title: string;
  desc: string;
  detail: string;
}

export interface ProcessStep {
  num: string;
  title: string;
  sub: string;
  image: string;
  items: string[];
}

export interface PortfolioItem {
  id: string;
  category: string;
  title: string;
  client: string;
  image: string;
  duration: string;
}

export interface SiteContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
    primaryButton: string;
    secondaryButton: string;
    cornerLabel: string;
  };
  highlights: HighlightItem[];
  about: {
    heading: string;
    intro: string;
    philosophyTitle: string;
    philosophy1: string;
    philosophy2: string;
    image: string;
    strengthsTitle: string;
    strengths: string[];
    fieldsTitle: string;
    fields: string[];
  };
  services: {
    title: string;
    subtitle: string;
    items: ServiceItem[];
    cta: {
      badge: string;
      title: string;
      desc: string;
      button: string;
    };
  };
  process: {
    title: string;
    subtitle: string;
    steps: ProcessStep[];
  };
  portfolio: {
    title: string;
    subtitle: string;
    categories: string[];
    items: PortfolioItem[];
    bottomButton: string;
  };
  contact: {
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    instagram: string;
    kakao: string;
    responseTitle: string;
    responseText: string;
    formServices: string[];
    successTitle: string;
    successMessage: string;
  };
  footer: {
    tagline: string;
    ctaButton: string;
    email: string;
    phone: string;
    instagramHandle: string;
    copyright: string;
    taglineBottom: string;
  };
}

export type SiteSectionKey =
  | "hero"
  | "highlights"
  | "about"
  | "services"
  | "process"
  | "portfolio"
  | "contact"
  | "footer";
