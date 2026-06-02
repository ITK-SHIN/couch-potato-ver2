import {

  createContext,

  useCallback,

  useContext,

  useEffect,

  useMemo,

  useRef,

  useState,

  type ReactNode,

} from "react";

import { defaultSiteContent } from "../data/defaultSiteContent";

import { loadSiteContent, saveSiteContent } from "../lib/contentStore";

import type { SiteContent } from "../types/siteContent";



interface SiteContentContextValue {

  /** Supabase·localStorage에 저장된 발행본 (공개 사이트용) */

  content: SiteContent;

  loading: boolean;

  saving: boolean;

  refresh: () => Promise<void>;

  /** 발행본 저장. payload 없으면 현재 발행본 유지 */

  save: (payload: SiteContent) => Promise<void>;

}



const SiteContentContext = createContext<SiteContentContextValue | null>(null);



export function SiteContentProvider({ children }: { children: ReactNode }) {

  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  const contentRef = useRef(content);

  contentRef.current = content;

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



  const save = useCallback(async (payload: SiteContent) => {

    setSaving(true);

    try {

      await saveSiteContent(payload);

      setContent(payload);

      contentRef.current = payload;

    } finally {

      setSaving(false);

    }

  }, []);



  const value = useMemo(

    () => ({

      content,

      loading,

      saving,

      refresh,

      save,

    }),

    [content, loading, saving, refresh, save]

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


