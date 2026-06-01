import type { PortfolioItem } from "../types/siteContent";
import { emptyPortfolioItem } from "./portfolioVideo";
import {
  getYoutubeThumbnail,
  getYoutubeWatchUrl,
  parseYoutubeId,
} from "./youtube";

export async function fetchYoutubeTitle(videoId: string): Promise<string | null> {
  try {
    const url = getYoutubeWatchUrl(videoId);
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string };
    return data.title?.trim() || null;
  } catch {
    return null;
  }
}

/** 줄 단위 URL·ID 목록 → 포트폴리오 항목 (중복 ID 제외) */
export async function buildPortfolioItemsFromYoutubeLines(
  text: string,
  options: {
    category?: string;
    existingIds?: Set<string>;
    fetchTitles?: boolean;
  } = {}
): Promise<{ items: PortfolioItem[]; skipped: number; invalid: number }> {
  const category = options.category ?? "유튜브";
  const seen = new Set(options.existingIds ?? []);
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const items: PortfolioItem[] = [];
  let skipped = 0;
  let invalid = 0;

  for (const line of lines) {
    const id = parseYoutubeId(line);
    if (!id) {
      invalid += 1;
      continue;
    }
    if (seen.has(id)) {
      skipped += 1;
      continue;
    }
    seen.add(id);

    let title = "YouTube 작품";
    if (options.fetchTitles !== false) {
      const fetched = await fetchYoutubeTitle(id);
      if (fetched) title = fetched;
    }

    items.push(
      emptyPortfolioItem({
        id: `yt-${id}`,
        category,
        title,
        client: "Try to 신감독",
        image: getYoutubeThumbnail(id),
        duration: "",
        videoType: "youtube",
        youtubeUrl: getYoutubeWatchUrl(id),
        videoUrl: "",
      })
    );
  }

  return { items, skipped, invalid };
}
