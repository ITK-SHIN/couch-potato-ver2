import type { PortfolioItem } from "../types/siteContent";
import { emptyPortfolioItem } from "./portfolioVideo";
import {
  getYoutubeThumbnail,
  getYoutubeWatchUrl,
  parseYoutubeId,
} from "./youtube";

type YoutubeOembed = {
  title?: string;
  author_name?: string;
};

async function fetchYoutubeOembed(
  videoId: string
): Promise<YoutubeOembed | null> {
  try {
    const url = getYoutubeWatchUrl(videoId);
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!res.ok) return null;
    return (await res.json()) as YoutubeOembed;
  } catch {
    return null;
  }
}

export async function fetchYoutubeTitle(videoId: string): Promise<string | null> {
  const data = await fetchYoutubeOembed(videoId);
  return data?.title?.trim() || null;
}

export type YoutubeVideoMetadata = {
  title: string;
  client: string;
  duration: string;
  image: string;
};

/** oEmbed(제목·채널) + API(재생 시간)로 작품 메타 자동 채움 */
export async function fetchYoutubeVideoMetadata(
  videoIdOrUrl: string
): Promise<YoutubeVideoMetadata | null> {
  const id = parseYoutubeId(videoIdOrUrl) ?? videoIdOrUrl.trim();
  if (!id) return null;

  const oembed = await fetchYoutubeOembed(id);
  let duration = "";
  let title = oembed?.title?.trim() ?? "";

  try {
    const res = await fetch(
      `/api/youtube-metadata?v=${encodeURIComponent(id)}`
    );
    if (res.ok) {
      const data = (await res.json()) as {
        title?: string | null;
        duration?: string | null;
      };
      if (data.duration?.trim()) duration = data.duration.trim();
      if (!title && data.title?.trim()) title = data.title.trim();
    }
  } catch {
    /* 로컬/배포 없을 때 재생 시간만 비움 */
  }

  return {
    title,
    client: oembed?.author_name?.trim() ?? "",
    duration,
    image: getYoutubeThumbnail(id),
  };
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
