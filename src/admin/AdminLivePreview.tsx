import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { SitePageContent } from "../components/SitePageContent";
import type { SiteSectionKey } from "../types/siteContent";

const SECTION_ANCHOR: Record<SiteSectionKey, string> = {
  hero: "home",
  highlights: "highlights",
  about: "about",
  services: "service",
  process: "process",
  portfolio: "portfolio",
  contact: "contact",
  footer: "footer",
};

const SITE_LAYOUT_WIDTH = 1280;

export function AdminLivePreview({
  activeSection,
  mobileOpen,
  onToggleMobile,
}: {
  activeSection: SiteSectionKey;
  mobileOpen: boolean;
  onToggleMobile: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const updateScale = () => {
      const w = root.clientWidth;
      setScale(Math.min(1, w / SITE_LAYOUT_WIDTH));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const target = root.querySelector(`#${SECTION_ANCHOR[activeSection]}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection]);

  return (
    <>
      <button
        type="button"
        onClick={onToggleMobile}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 text-sm shadow-lg"
        style={{ borderRadius: "2px" }}
      >
        {mobileOpen ? <EyeOff size={18} /> : <Eye size={18} />}
        {mobileOpen ? "미리보기 닫기" : "미리보기"}
      </button>

      {/* lg: 그리드 2열 중 오른쪽 50% · 모바일: 슬라이드 패널 */}
      <aside
        className={`
          flex-col min-h-0 h-full w-full bg-card
          lg:flex
          max-lg:fixed max-lg:right-0 max-lg:z-30 max-lg:top-[57px] max-lg:bottom-0
          max-lg:w-full max-lg:border-l max-lg:shadow-2xl
          ${mobileOpen ? "max-lg:flex" : "max-lg:hidden"}
        `}
      >
        <div className="shrink-0 px-4 py-3 border-b border-border bg-secondary/50">
          <p className="text-sm font-medium text-foreground">실시간 미리보기</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            입력 즉시 반영 · 저장 전에도 확인 가능
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden bg-neutral-950"
        >
          <div
            className="pointer-events-none origin-top-left"
            style={{
              transform: `scale(${scale})`,
              width: scale > 0 ? `${100 / scale}%` : "100%",
            }}
          >
            <SitePageContent />
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          aria-label="미리보기 닫기"
          className="lg:hidden fixed inset-0 z-20 bg-black/40"
          onClick={onToggleMobile}
        />
      )}
    </>
  );
}
