import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { PortfolioItem } from "../../types/siteContent";
import { emptyPortfolioItem } from "../../lib/portfolioVideo";
import { firstPortfolioItemCategory } from "../../lib/portfolioCategories";
import { fetchYoutubeVideoMetadata } from "../../lib/portfolioYoutubeImport";
import { getYoutubeThumbnail, parseYoutubeId } from "../../lib/youtube";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../app/components/ui/dialog";
import { PortfolioItemFormFields } from "./PortfolioItemFormFields";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onConfirm: (item: PortfolioItem) => void;
};

function createDraft(categories: string[]): PortfolioItem {
  return emptyPortfolioItem({
    title: "",
    client: "",
    category: firstPortfolioItemCategory(categories),
    image: "",
    duration: "",
    videoType: "youtube",
    youtubeUrl: "",
    videoUrl: "",
  });
}

export function PortfolioItemAddDialog({
  open,
  onOpenChange,
  categories,
  onConfirm,
}: Props) {
  const [draft, setDraft] = useState(() => createDraft(categories));
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(createDraft(categories));
    }
  }, [open, categories]);

  const handleConfirm = async () => {
    const ytId = parseYoutubeId(draft.youtubeUrl ?? "");
    if (!ytId) {
      toast.error("YouTube URL을 입력해 주세요.");
      return;
    }

    setConfirming(true);
    try {
      let next = { ...draft };
      if (!next.title.trim() || !next.duration.trim() || !next.image?.trim()) {
        const meta = await fetchYoutubeVideoMetadata(ytId);
        if (meta) {
          next = {
            ...next,
            title: next.title.trim() || meta.title,
            duration: next.duration.trim() || meta.duration,
            image: next.image?.trim() || meta.image,
            client: next.client.trim() || meta.client,
          };
        }
      }

      const title = next.title.trim();
      if (!title) {
        toast.error("제목을 입력하거나 YouTube URL로 자동 불러오기를 기다려 주세요.");
        return;
      }

      const image = next.image?.trim() || getYoutubeThumbnail(ytId);
      onConfirm({
        ...next,
        title,
        image,
        duration: next.duration.trim() || "0:00",
      });
      onOpenChange(false);
      toast.success(
        "맨 앞(1번)에 추가했습니다. 저장 버튼을 눌러 사이트에 반영하세요."
      );
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[min(90vh,720px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>포트폴리오 작품 추가</DialogTitle>
        </DialogHeader>
        <PortfolioItemFormFields
          item={draft}
          categories={categories}
          onChange={setDraft}
          autoYoutubeMetadata
        />
        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={confirming}
            className="px-4 py-2 border border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
            style={{ borderRadius: "2px" }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={confirming}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            style={{ borderRadius: "2px" }}
          >
            {confirming ? "확인 중…" : "확인 · 추가"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
