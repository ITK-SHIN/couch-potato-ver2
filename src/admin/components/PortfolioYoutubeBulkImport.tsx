import { useState } from "react";
import { toast } from "sonner";
import type { PortfolioItem } from "../../types/siteContent";
import { buildPortfolioItemsFromYoutubeLines } from "../../lib/portfolioYoutubeImport";
import { parseYoutubeId } from "../../lib/youtube";
import { AdminField, AdminInput, AdminTextarea } from "./AdminField";

function collectYoutubeIds(items: PortfolioItem[]): Set<string> {
  const seen = new Set<string>();
  for (const item of items) {
    const id = parseYoutubeId(item.youtubeUrl ?? "");
    if (id) seen.add(id);
    if (item.id.startsWith("yt-")) seen.add(item.id.slice(3));
  }
  return seen;
}

export function PortfolioYoutubeBulkImport({
  items,
  onAddItems,
}: {
  items: PortfolioItem[];
  onAddItems: (newItems: PortfolioItem[]) => void;
}) {
  const [bulkText, setBulkText] = useState("");
  const [clientLabel, setClientLabel] = useState("Try to 신감독");
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    if (!bulkText.trim()) {
      toast.error("YouTube URL을 한 줄에 하나씩 붙여넣어 주세요.");
      return;
    }

    setImporting(true);
    try {
      const { items: created, skipped, invalid } =
        await buildPortfolioItemsFromYoutubeLines(bulkText, {
          category: "유튜브",
          existingIds: collectYoutubeIds(items),
          fetchTitles: true,
        });

      if (created.length === 0) {
        toast.error(
          invalid > 0
            ? "올바른 YouTube URL이 없습니다. watch?v= 또는 youtu.be 링크를 확인하세요."
            : "추가할 새 영상이 없습니다. (이미 등록된 URL)"
        );
        return;
      }

      const withClient = created.map((item) => ({
        ...item,
        client: clientLabel.trim() || "TryToShinDirect",
      }));

      onAddItems(withClient);
      setBulkText("");

      const parts = [`${withClient.length}개 영상을 추가했습니다.`];
      if (skipped) parts.push(`중복 ${skipped}개 제외`);
      if (invalid) parts.push(`잘못된 줄 ${invalid}개`);
      toast.success(parts.join(" "));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "가져오기 실패");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-4 border border-primary/30 bg-primary/5 space-y-4 rounded-sm">
      <div>
        <p className="text-sm font-semibold text-foreground">YouTube 채널 영상 일괄 추가</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          채널{" "}
          <a
            href="https://www.youtube.com/@TryToShinDirect./videos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @TryToShinDirect.
          </a>{" "}
          의 <strong>동영상</strong> 탭에서 영상마다 링크 복사 → 아래에 한 줄에 하나씩 붙여넣기.
          저장 버튼을 눌러야 사이트에 반영됩니다.
        </p>
      </div>
      <AdminField label="클라이언트 표시 (공통)">
        <AdminInput
          value={clientLabel}
          onChange={(e) => setClientLabel(e.target.value)}
          placeholder="Try to 신감독"
        />
      </AdminField>
      <AdminField
        label="YouTube URL 목록"
        hint="예: https://www.youtube.com/watch?v=xxxxxxxxxxx"
      >
        <AdminTextarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder={
            "https://www.youtube.com/watch?v=...\nhttps://youtu.be/...\n..."
          }
          rows={8}
          className="font-mono text-xs"
        />
      </AdminField>
      <button
        type="button"
        disabled={importing}
        onClick={() => void handleImport()}
        className="px-4 py-2 bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
        style={{ borderRadius: "2px" }}
      >
        {importing ? "제목 불러오는 중..." : "목록에서 포트폴리오로 추가"}
      </button>
    </div>
  );
}
