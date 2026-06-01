import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Play,
} from "lucide-react";
import { useSiteContentDisplay } from "../../context/SiteContentDisplayContext";
import {
  canPlayPortfolioItem,
  getPortfolioThumbnail,
} from "../../lib/portfolioVideo";
import { PortfolioVideoModal } from "./PortfolioVideoModal";
import type { PortfolioItem } from "../../types/siteContent";

const PAGE_SIZE = 8;

export function PortfolioSection() {
  const content = useSiteContentDisplay();
  const { title, subtitle, categories, items, bottomButton } = content.portfolio;
  const [searchParams, setSearchParams] = useSearchParams();

  const readCategory = useCallback(() => {
    const cat = searchParams.get("category");
    if (!cat) return "전체";
    if (cat === "전체" || categories.includes(cat)) return cat;
    return "전체";
  }, [searchParams, categories]);

  const readPage = useCallback(() => {
    const p = Number.parseInt(searchParams.get("page") ?? "1", 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  }, [searchParams]);

  const [activeCategory, setActiveCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [hovered, setHovered] = useState<string | null>(null);
  const [playingItem, setPlayingItem] = useState<PortfolioItem | null>(null);

  const filtered = useMemo(
    () =>
      activeCategory === "전체"
        ? items
        : items.filter((p) => p.category === activeCategory),
    [activeCategory, items]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const syncUrl = useCallback(
    (category: string, page: number) => {
      const next = new URLSearchParams();
      if (category !== "전체") next.set("category", category);
      if (page > 1) next.set("page", String(page));
      setSearchParams(next, { replace: true });
    },
    [setSearchParams]
  );

  useEffect(() => {
    const cat = readCategory();
    const page = readPage();
    setActiveCategory(cat);
    setCurrentPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- URL → state on external navigation
  }, [searchParams]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
      syncUrl(activeCategory, totalPages);
    }
  }, [currentPage, totalPages, activeCategory, syncUrl]);

  const selectCategory = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    syncUrl(cat, 1);
  };

  const goToPage = (page: number) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    syncUrl(activeCategory, next);
    document.getElementById("portfolio-grid")?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  const openItem = (item: PortfolioItem) => {
    if (canPlayPortfolioItem(item)) {
      setPlayingItem(item);
    }
  };

  return (
    <section id="portfolio" className="py-32 px-6 bg-secondary">
      <PortfolioVideoModal item={playingItem} onClose={() => setPlayingItem(null)} />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span
            className="text-primary"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", letterSpacing: "0.3em" }}
          >
            PORTFOLIO
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2
              className="text-foreground leading-tight mb-2"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
            >
              {title}
            </h2>
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => selectCategory(cat)}
                className={`px-4 py-1.5 text-xs transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
                style={{ borderRadius: "2px" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div
          id="portfolio-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {paginatedItems.map((item) => {
            const playable = canPlayPortfolioItem(item);
            const thumb = getPortfolioThumbnail(item);

            return (
              <div
                key={item.id}
                role={playable ? "button" : undefined}
                tabIndex={playable ? 0 : undefined}
                className={`relative overflow-hidden group ${
                  playable ? "cursor-pointer" : "cursor-default"
                }`}
                style={{ aspectRatio: "4/3" }}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => openItem(item)}
                onKeyDown={(e) => {
                  if (playable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    openItem(item);
                  }
                }}
              >
                <img
                  src={thumb}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-black/60 flex flex-col justify-between p-5 transition-opacity duration-300"
                  style={{ opacity: hovered === item.id ? 1 : 0 }}
                >
                  <div>
                    <span className="text-primary text-xs tracking-wider" style={{ letterSpacing: "0.1em" }}>
                      {item.category}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white mb-1" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                      {item.title}
                    </h4>
                    <p className="text-white/60 text-xs">{item.client}</p>
                    {playable && (
                      <p className="text-white/50 text-xs mt-2">클릭하여 재생</p>
                    )}
                  </div>
                </div>
                {playable && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center transition-opacity duration-300"
                      style={{ opacity: hovered === item.id ? 0 : 0.85 }}
                    >
                      <Play size={20} className="text-white fill-white ml-0.5" />
                    </div>
                  </div>
                )}
                {item.duration && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-full pointer-events-none">
                    {playable && <Play size={10} className="text-white fill-white" />}
                    <span className="text-white text-xs">{item.duration}</span>
                  </div>
                )}
                <div
                  className="absolute top-3 left-3 bg-background/80 px-2 py-0.5 transition-opacity duration-300 pointer-events-none"
                  style={{ opacity: hovered === item.id ? 0 : 1, borderRadius: "2px" }}
                >
                  <span className="text-foreground/70 text-xs">{item.category}</span>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <nav
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            aria-label="포트폴리오 페이지"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(1)}
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                style={{ borderRadius: "2px" }}
                aria-label="첫 페이지"
              >
                <ChevronsLeft size={16} />
                처음
              </button>
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                style={{ borderRadius: "2px" }}
                aria-label="이전 페이지"
              >
                <ChevronLeft size={16} />
                이전
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`min-w-[2.25rem] h-9 px-2 text-xs transition-all ${
                    page === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-foreground hover:border-primary"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  {page}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                style={{ borderRadius: "2px" }}
                aria-label="다음 페이지"
              >
                다음
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                style={{ borderRadius: "2px" }}
                aria-label="마지막 페이지"
              >
                마지막
                <ChevronsRight size={16} />
              </button>
            </div>

            <p className="text-muted-foreground text-xs sm:ml-2">
              {currentPage} / {totalPages}
              <span className="hidden sm:inline"> · 총 {filtered.length}개</span>
            </p>
          </nav>
        )}

        <div className="text-center mt-12">
          <button
            type="button"
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="border border-border text-muted-foreground px-8 py-3 text-sm hover:border-primary hover:text-primary transition-all"
            style={{ borderRadius: "2px" }}
          >
            {bottomButton}
          </button>
        </div>
      </div>
    </section>
  );
}
