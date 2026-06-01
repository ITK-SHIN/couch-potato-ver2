import { useEffect, useRef } from "react";
import type { SiteContent } from "../types/siteContent";

const STORAGE_KEY = "couchpotato-admin-draft-autosave";

/** Supabase 저장 없이 로컬에만 초안 자동 저장 (30초 디바운스) */
export function useDraftAutosave(
  draft: SiteContent,
  hasUnsavedChanges: boolean
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch {
        /* quota */
      }
    }, 30_000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [draft, hasUnsavedChanges]);
}

export function loadAutosavedDraft(): SiteContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SiteContent;
  } catch {
    return null;
  }
}

export function clearAutosavedDraft() {
  localStorage.removeItem(STORAGE_KEY);
}
