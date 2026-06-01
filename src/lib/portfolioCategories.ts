/** 포트폴리오 필터·작품 카테고리 (「전체」는 필터 전용) */
export const DEFAULT_PORTFOLIO_CATEGORIES = [
  "전체",
  "브랜드 콘텐츠",
  "인터뷰 영상",
  "행사 영상",
  "숏폼 콘텐츠",
  "유튜브",
] as const;

export const PORTFOLIO_ITEM_CATEGORY_OPTIONS = DEFAULT_PORTFOLIO_CATEGORIES.filter(
  (c) => c !== "전체"
);

export function portfolioItemCategoryOptions(
  categories: string[] | undefined
): string[] {
  const fromContent = (categories ?? []).filter((c) => c !== "전체");
  return fromContent.length > 0 ? fromContent : [...PORTFOLIO_ITEM_CATEGORY_OPTIONS];
}

export function firstPortfolioItemCategory(
  categories: string[] | undefined
): string {
  return (
    portfolioItemCategoryOptions(categories)[0] ??
    PORTFOLIO_ITEM_CATEGORY_OPTIONS[0]
  );
}

export function distributePortfolioCategories<T extends { category: string }>(
  items: T[]
): T[] {
  const buckets = PORTFOLIO_ITEM_CATEGORY_OPTIONS;
  return items.map((item, index) => ({
    ...item,
    category: buckets[index % buckets.length],
  }));
}
