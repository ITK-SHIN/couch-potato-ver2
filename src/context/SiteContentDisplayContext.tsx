import { createContext, useContext, type ReactNode } from "react";
import type { SiteContent } from "../types/siteContent";
import { useSiteContent } from "./SiteContentContext";

const PreviewContentContext = createContext<SiteContent | null>(null);

/** 관리자 미리보기: draft만 주입. 공개 사이트는 Provider 없이 발행본 사용 */
export function SiteContentPreviewProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: ReactNode;
}) {
  return (
    <PreviewContentContext.Provider value={content}>
      {children}
    </PreviewContentContext.Provider>
  );
}

/** 섹션·페이지 본문이 읽는 콘텐츠 (미리보기 draft 또는 발행본) */
export function useSiteContentDisplay(): SiteContent {
  const preview = useContext(PreviewContentContext);
  const { content: published } = useSiteContent();
  return preview ?? published;
}
