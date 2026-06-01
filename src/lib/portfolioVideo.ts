import type { PortfolioItem } from "../types/siteContent";
import { getYoutubeThumbnail, parseYoutubeId } from "./youtube";

export function getYoutubeIdFromItem(item: PortfolioItem): string | null {
  if (item.videoType !== "youtube") return null;
  return item.youtubeUrl ? parseYoutubeId(item.youtubeUrl) : null;
}

export function canPlayPortfolioItem(item: PortfolioItem): boolean {
  if (item.videoType === "youtube") {
    return !!getYoutubeIdFromItem(item);
  }
  if (item.videoType === "upload") {
    return !!item.videoUrl?.trim();
  }
  return false;
}

export function getPortfolioThumbnail(item: PortfolioItem): string {
  if (item.image?.trim()) return item.image;
  const ytId = getYoutubeIdFromItem(item);
  if (ytId) return getYoutubeThumbnail(ytId);
  return item.image;
}

export const emptyPortfolioItem = (
  overrides: Partial<PortfolioItem> = {}
): PortfolioItem => ({
  id: "",
  category: "브랜드 콘텐츠",
  title: "새 작품",
  client: "",
  image: "",
  duration: "0:00",
  videoType: "none",
  youtubeUrl: "",
  videoUrl: "",
  ...overrides,
});
