import { useState } from "react";
import { Upload } from "lucide-react";
import { uploadVideo } from "../../lib/contentStore";
import { isSupabaseConfigured } from "../../lib/supabase";
import { AdminField, AdminInput } from "./AdminField";

const MAX_MB = 50;

export function VideoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadVideo(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminField
      label={label}
      hint={
        isSupabaseConfigured
          ? `MP4·WebM, 최대 ${MAX_MB}MB. Supabase Storage(media)에 저장됩니다.`
          : "영상 업로드는 Supabase 연결 후 사용할 수 있습니다. YouTube URL을 권장합니다."
      }
    >
      <div className="space-y-3">
        <AdminInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... (업로드 후 자동 입력)"
        />
        <label
          className={`inline-flex items-center gap-2 px-4 py-2 border border-border text-sm transition-colors ${
            isSupabaseConfigured
              ? "text-muted-foreground hover:border-primary hover:text-primary cursor-pointer"
              : "text-muted-foreground/50 cursor-not-allowed"
          }`}
        >
          <Upload size={16} />
          {uploading ? "업로드 중..." : "영상 업로드"}
          <input
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            disabled={uploading || !isSupabaseConfigured}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </label>
        {value && (
          <video
            src={value}
            controls
            className="w-full max-h-40 border border-border bg-black"
            style={{ borderRadius: "2px" }}
          />
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </AdminField>
  );
}
