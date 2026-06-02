import { BRAND_LOGO_SRC } from "../lib/siteConfig";

type BrandLogoProps = {
  variant?: "nav" | "hero" | "footer";
  className?: string;
};

const sizeByVariant = {
  /** h-16(64px) 네비 안 — 바 높이에 맞춘 최대 크기 */
  nav: "h-12 w-auto max-w-[180px] sm:h-14 sm:max-w-[210px]",
  /** 히어로 중앙 — 배지·부제·CTA 사이 시선 앵커 */
  hero:
    "w-[min(72vw,13.5rem)] sm:w-[17rem] md:w-[19.5rem] lg:w-[21.5rem] h-auto mx-auto drop-shadow-[0_4px_32px_rgba(0,0,0,0.5)]",
  /** 푸터 좌측 — 기존 wordmark(2~2.5rem) 대비, 태그라인·CTA와 균형 */
  footer: "w-[10.25rem] sm:w-[11.25rem] md:w-[12rem] h-auto max-w-full",
} as const;

const intrinsicSizeByVariant = {
  nav: { width: 210, height: 56 },
  hero: { width: 344, height: 344 },
  footer: { width: 192, height: 192 },
} as const;

export function BrandLogo({ variant = "nav", className = "" }: BrandLogoProps) {
  const { width, height } = intrinsicSizeByVariant[variant];

  return (
    <img
      src={BRAND_LOGO_SRC}
      alt="COUCHPOTATO"
      className={`block object-contain object-left ${sizeByVariant[variant]} ${className}`.trim()}
      width={width}
      height={height}
      decoding="async"
      {...(variant === "hero" ? { fetchPriority: "high" as const } : {})}
    />
  );
}
