function parseYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id && id.length === 11 ? id : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = parsed.searchParams.get("v");
      if (v && v.length === 11) return v;
      const paths = parsed.pathname.split("/").filter(Boolean);
      const shortsIdx = paths.indexOf("shorts");
      if (shortsIdx >= 0 && paths[shortsIdx + 1]?.length === 11) {
        return paths[shortsIdx + 1];
      }
      const embedIdx = paths.indexOf("embed");
      if (embedIdx >= 0 && paths[embedIdx + 1]?.length === 11) {
        return paths[embedIdx + 1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

export type YoutubeMetadataResult = {
  videoId: string;
  title: string | null;
  duration: string | null;
  durationSeconds: number | null;
};

/** 초 → 포트폴리오 표시용 (예: 3:24, 1:05:30) */
export function formatYoutubeDurationSeconds(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function parseDurationSecondsFromWatchHtml(html: string): number | null {
  const lengthMatch = html.match(/"lengthSeconds"\s*:\s*"?(\d+)"?/);
  if (lengthMatch) {
    const n = Number(lengthMatch[1]);
    if (Number.isFinite(n) && n > 0) return n;
  }
  const approxMatch = html.match(/"approxDurationMs"\s*:\s*"?(\d+)"?/);
  if (approxMatch) {
    const ms = Number(approxMatch[1]);
    if (Number.isFinite(ms) && ms > 0) return Math.round(ms / 1000);
  }
  return null;
}

export function parseTitleFromWatchHtml(html: string): string | null {
  const og = html.match(
    /<meta\s+property="og:title"\s+content="([^"]+)"/i
  );
  if (og?.[1]) {
    return og[1].replace(/ - YouTube$/i, "").trim() || null;
  }
  const titleMatch = html.match(/"title"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (titleMatch?.[1]) {
    try {
      return JSON.parse(`"${titleMatch[1]}"`).trim() || null;
    } catch {
      return titleMatch[1].trim() || null;
    }
  }
  return null;
}

/** 서버·미들웨어에서 YouTube watch 페이지 HTML로 메타 추출 */
export async function fetchYoutubeMetadataFromWatchPage(
  videoId: string
): Promise<YoutubeMetadataResult> {
  const id = parseYoutubeId(videoId) ?? videoId;
  if (!id || id.length !== 11) {
    return {
      videoId: "",
      title: null,
      duration: null,
      durationSeconds: null,
    };
  }

  try {
    const res = await fetch(
      `https://www.youtube.com/watch?v=${encodeURIComponent(id)}&hl=ko`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        },
      }
    );
    if (!res.ok) {
      return { videoId: id, title: null, duration: null, durationSeconds: null };
    }
    const html = await res.text();
    const durationSeconds = parseDurationSecondsFromWatchHtml(html);
    const title = parseTitleFromWatchHtml(html);
    return {
      videoId: id,
      title,
      duration:
        durationSeconds != null
          ? formatYoutubeDurationSeconds(durationSeconds)
          : null,
      durationSeconds,
    };
  } catch {
    return { videoId: id, title: null, duration: null, durationSeconds: null };
  }
}
