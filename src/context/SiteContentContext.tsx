import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultSiteContent } from "../data/defaultSiteContent";
import { loadSiteContent, saveSiteContent } from "../lib/contentStore";
import type { SiteContent } from "../types/siteContent";

interface SiteContentContextValue {
  content: SiteContent;
  loading: boolean;
  saving: boolean;
  refresh: () => Promise<void>;
  updateContent: (next: SiteContent) => void;
  save: (next?: SiteContent) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadSiteContent();
      setContent(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateContent = useCallback((next: SiteContent) => {
    setContent(next);
  }, []);

  const save = useCallback(
    async (next?: SiteContent) => {
      const payload = next ?? content;
      setSaving(true);
      try {
        await saveSiteContent(payload);
        setContent(payload);
      } finally {
        setSaving(false);
      }
    },
    [content]
  );

  const value = useMemo(
    () => ({
      content,
      loading,
      saving,
      refresh,
      updateContent,
      save,
    }),
    [content, loading, saving, refresh, updateContent, save]
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return ctx;
}
