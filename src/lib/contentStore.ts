import { defaultSiteContent } from "../data/defaultSiteContent";
import { mergeSiteContent } from "./mergeContent";
import {
  isSupabaseConfigured,
  SITE_CONTENT_ROW_ID,
  supabase,
} from "./supabase";
import type { SiteContent } from "../types/siteContent";

const STORAGE_KEY = "couchpotato-site-content";

export async function loadSiteContent(): Promise<SiteContent> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("id", SITE_CONTENT_ROW_ID)
      .maybeSingle();

    if (!error && data?.content) {
      return mergeSiteContent(data.content as Partial<SiteContent>);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return mergeSiteContent(JSON.parse(raw) as Partial<SiteContent>);
    }
  } catch {
    /* ignore */
  }

  return defaultSiteContent;
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("site_content").upsert({
      id: SITE_CONTENT_ROW_ID,
      content,
      updated_at: new Date().toISOString(),
    });

    if (error) throw new Error(error.message);
  }
}

export async function uploadImage(file: File): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    return new Promise((resolve, reject) => {
      if (file.size > 2 * 1024 * 1024) {
        reject(
          new Error(
            "Supabase 미연결 시 이미지는 2MB 이하만 가능합니다. CMS_SETUP.md를 참고해 Supabase를 연결하세요."
          )
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("이미지 읽기 실패"));
      reader.readAsDataURL(file);
    });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, file, { upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const VIDEO_MIME = new Set(["video/mp4", "video/webm"]);

export async function uploadVideo(file: File): Promise<string> {
  if (!VIDEO_MIME.has(file.type)) {
    throw new Error("MP4 또는 WebM 영상만 업로드할 수 있습니다.");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error(`영상은 ${MAX_VIDEO_BYTES / (1024 * 1024)}MB 이하만 가능합니다.`);
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      "영상 업로드는 Supabase 연결이 필요합니다. SUPABASE_연결가이드.md를 참고하거나 YouTube URL을 사용하세요."
    );
  }

  const ext = file.type === "video/webm" ? "webm" : "mp4";
  const path = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, file, {
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
