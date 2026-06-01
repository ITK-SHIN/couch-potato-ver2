import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import type { PortfolioItem } from "../../types/siteContent";
import {
  canPlayPortfolioItem,
  getYoutubeIdFromItem,
} from "../../lib/portfolioVideo";
import { getYoutubeEmbedUrl, getYoutubeWatchUrl } from "../../lib/youtube";

type Props = {
  item: PortfolioItem | null;
  onClose: () => void;
};

export function PortfolioVideoModal({ item, onClose }: Props) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item || !canPlayPortfolioItem(item)) return null;

  const youtubeId =
    item.videoType === "youtube" ? getYoutubeIdFromItem(item) : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/85"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-video-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white p-2"
          aria-label="닫기"
        >
          <X size={24} />
        </button>

        <div className="mb-3 pr-10">
          <h3
            id="portfolio-video-title"
            className="text-white text-lg font-semibold"
          >
            {item.title}
          </h3>
          {item.client && (
            <p className="text-white/60 text-sm mt-0.5">{item.client}</p>
          )}
        </div>

        <div
          className="relative w-full overflow-hidden bg-black"
          style={{ aspectRatio: "16/9", borderRadius: "4px" }}
        >
          {youtubeId && (
            <iframe
              src={getYoutubeEmbedUrl(youtubeId)}
              title={item.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {item.videoType === "upload" && item.videoUrl && (
            <video
              src={item.videoUrl}
              className="absolute inset-0 w-full h-full"
              controls
              autoPlay
              playsInline
            />
          )}
        </div>

        {youtubeId && (
          <a
            href={getYoutubeWatchUrl(youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-sm text-white/70 hover:text-primary transition-colors"
          >
            YouTube에서 보기
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
