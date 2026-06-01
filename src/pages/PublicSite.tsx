import { PageLoader } from "../components/PageLoader";
import { SitePageContent } from "../components/SitePageContent";
import { SiteSeo } from "../components/SiteSeo";
import { useSiteContent } from "../context/SiteContentContext";

export function PublicSite() {
  const { content, loading } = useSiteContent();

  if (loading) {
    return (
      <PageLoader
        message="사이트를 불러오는 중"
        subMessage="콘텐츠를 준비하고 있습니다"
      />
    );
  }

  return (
    <>
      <SiteSeo content={content} />
      <SitePageContent />
    </>
  );
}
