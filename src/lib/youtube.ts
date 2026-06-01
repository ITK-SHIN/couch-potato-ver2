/** YouTube URL에서 11자리 영상 ID 추출 */
export function parseYoutubeId(url: string): string | null {
  const trimmed = url.trim();
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
      const embedIdx = paths.indexOf("embed");
      if (embedIdx >= 0 && paths[embedIdx + 1]?.length === 11) {
        return paths[embedIdx + 1];
      }
      const shortsIdx = paths.indexOf("shorts");
      if (shortsIdx >= 0 && paths[shortsIdx + 1]?.length === 11) {
        return paths[shortsIdx + 1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYoutubeThumbnail(videoId: string, quality: "hq" | "max" = "hq"): string {
  const file = quality === "max" ? "maxresdefault.jpg" : "hqdefault.jpg";
  return `https://img.youtube.com/vi/${videoId}/${file}`;
}

export function getYoutubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
}

export function getYoutubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
