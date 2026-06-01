import { isSupabaseConfigured, supabase } from "./supabase";
import type { SiteContent } from "../types/siteContent";

export type ContentRevisionRow = {
  id: string;
  content: SiteContent;
  label: string | null;
  created_at: string;
};

export async function saveContentRevision(
  content: SiteContent,
  label?: string
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.from("site_content_revisions").insert({
    content,
    label: label ?? new Date().toLocaleString("ko-KR"),
  });

  if (error) {
    console.warn("[revisions] save skipped:", error.message);
  }
}

export async function listContentRevisions(
  limit = 20
): Promise<ContentRevisionRow[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from("site_content_revisions")
    .select("id, content, label, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as ContentRevisionRow[];
}
