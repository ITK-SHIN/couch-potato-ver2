import { SitePageContent } from "../components/SitePageContent";
import { useSiteContent } from "../context/SiteContentContext";

export function PublicSite() {
  const { loading } = useSiteContent();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">
        불러오는 중...
      </div>
    );
  }

  return <SitePageContent />;
}
