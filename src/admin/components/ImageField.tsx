import { useState } from "react";
import { Upload } from "lucide-react";
import { uploadImage } from "../../lib/contentStore";
import { isSupabaseConfigured } from "../../lib/supabase";
import { AdminField, AdminInput } from "./AdminField";

export function ImageField({
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
      const url = await uploadImage(file);
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
          ? "파일을 업로드하거나 이미지 주소를 직접 입력하세요."
          : "Supabase 연결 전에는 작은 이미지만 업로드 가능합니다. URL 입력을 권장합니다."
      }
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {value && (
          <div
            className="w-full sm:w-40 shrink-0 overflow-hidden border border-border bg-muted"
            style={{ aspectRatio: "16/10", borderRadius: "2px" }}
          >
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 space-y-3">
          <AdminInput
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
          />
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors">
            <Upload size={16} />
            {uploading ? "업로드 중..." : "이미지 업로드"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
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
