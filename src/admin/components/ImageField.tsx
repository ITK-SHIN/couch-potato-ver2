import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { uploadImage } from "../../lib/contentStore";
import {
  ADMIN_IMAGE_PRESETS,
  prepareImageForUpload,
  prepareImageFromUrl,
  previewAspectRatio,
  previewObjectFit,
  type AdminImagePreset,
} from "../../lib/imageResize";
import { isSupabaseConfigured } from "../../lib/supabase";
import { AdminField, AdminInput } from "./AdminField";

function shouldAutoProcessUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("data:image/")) return true;
  return /^https?:\/\//i.test(trimmed);
}

export function ImageField({
  label,
  hint,
  value,
  onChange,
  preset = "default",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  preset?: AdminImagePreset;
}) {
  const presetConfig = ADMIN_IMAGE_PRESETS[preset];
  const defaultHint = isSupabaseConfigured
    ? `파일·URL 모두 ${presetConfig.label}에 맞춥니다. ${
        presetConfig.fit === "contain"
          ? "로고·그래픽은 잘리지 않고 전체가 보입니다."
          : "화면을 꽉 채우도록 맞춥니다."
      } URL은 입력 후 다른 칸을 클릭하면 적용됩니다.`
    : "Supabase 연결 전에는 작은 이미지만 업로드 가능합니다.";

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftUrl, setDraftUrl] = useState(value);
  const lastCommittedRef = useRef(value);

  useEffect(() => {
    setDraftUrl(value);
    lastCommittedRef.current = value;
  }, [value]);

  const commitPreparedImage = async (prepare: () => Promise<File>) => {
    setUploading(true);
    setError(null);
    try {
      const prepared = await prepare();
      const url = await uploadImage(prepared);
      lastCommittedRef.current = url;
      setDraftUrl(url);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지 처리 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlBlur = async () => {
    const trimmed = draftUrl.trim();
    if (!shouldAutoProcessUrl(trimmed)) {
      if (trimmed !== value) onChange(trimmed);
      return;
    }
    if (trimmed === lastCommittedRef.current) return;
    await commitPreparedImage(() => prepareImageFromUrl(trimmed, preset));
  };

  return (
    <AdminField label={label} hint={hint ?? defaultHint}>
      <div className="flex flex-col sm:flex-row gap-4">
        {(value || draftUrl) && (
          <div
            className="w-full sm:max-w-[280px] shrink-0 overflow-hidden border border-border bg-muted"
            style={{
              aspectRatio: previewAspectRatio(preset),
              borderRadius: "2px",
            }}
          >
            <img
              src={value || draftUrl}
              alt=""
              className={`w-full h-full object-center ${
                previewObjectFit(preset) === "contain"
                  ? "object-contain"
                  : "object-cover"
              }`}
            />
          </div>
        )}
        <div className="flex-1 space-y-3 min-w-0">
          <AdminInput
            value={draftUrl}
            disabled={uploading}
            onChange={(e) => {
              setDraftUrl(e.target.value);
              setError(null);
            }}
            onBlur={() => void handleUrlBlur()}
            placeholder="https://..."
          />
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors">
            <Upload size={16} />
            {uploading ? "이미지 맞춤·업로드 중..." : "이미지 업로드"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void commitPreparedImage(() => prepareImageForUpload(f, preset));
                e.target.value = "";
              }}
            />
          </label>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </AdminField>
  );
}
