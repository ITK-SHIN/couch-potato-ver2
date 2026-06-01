import { useCallback, useEffect, useState } from "react";
import { History } from "lucide-react";
import { toast } from "sonner";
import {
  listContentRevisions,
  type ContentRevisionRow,
} from "../../lib/contentRevisions";
import { isSupabaseConfigured } from "../../lib/supabase";
import type { SiteContent } from "../../types/siteContent";
import { mergeSiteContent } from "../../lib/mergeContent";

type Props = {
  onRestore: (content: SiteContent) => void;
};

export function ContentRevisionsPanel({ onRestore }: Props) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ContentRevisionRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    try {
      setRows(await listContentRevisions(15));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  if (!isSupabaseConfigured) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        style={{ borderRadius: "2px" }}
      >
        <History size={16} />
        버전
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-full mt-2 z-50 w-80 max-h-96 overflow-y-auto border border-border bg-card shadow-lg p-3"
            style={{ borderRadius: "2px" }}
          >
            <p className="text-xs font-medium text-foreground mb-2">
              저장 이력 (최근 15건)
            </p>
            {loading && (
              <p className="text-xs text-muted-foreground">불러오는 중…</p>
            )}
            {!loading && rows.length === 0 && (
              <p className="text-xs text-muted-foreground">
                저장 후 이력이 쌓입니다. schema.sql의 revisions 테이블을 실행했는지
                확인하세요.
              </p>
            )}
            <ul className="space-y-2">
              {rows.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-2 text-xs border border-border/60 p-2"
                  style={{ borderRadius: "2px" }}
                >
                  <span className="text-muted-foreground truncate">
                    {row.label ||
                      new Date(row.created_at).toLocaleString("ko-KR")}
                  </span>
                  <button
                    type="button"
                    className="shrink-0 text-primary hover:underline"
                    onClick={() => {
                      onRestore(
                        mergeSiteContent(row.content as Partial<SiteContent>)
                      );
                      setOpen(false);
                      toast.message("초안에 복원했습니다. 저장·공개 반영을 눌러 주세요.");
                    }}
                  >
                    복원
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
