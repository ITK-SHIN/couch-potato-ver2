import { useCallback, useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { FittedImage } from "../../components/FittedImage";
import { uploadImage } from "../../lib/contentStore";
import { resolveDisplayImage } from "../../lib/displayImage";
import {
  ADMIN_IMAGE_PRESETS,
  IMAGE_UPLOAD_FIT_OPTIONS,
  presetForImageUploadFit,
  prepareImageForUpload,
  prepareImageFromUrl,
  previewAspectRatio,
  type AdminImagePreset,
} from "../../lib/imageResize";
import type { ImageUploadFit } from "../../types/siteContent";
import { isSupabaseConfigured } from "../../lib/supabase";
import { AdminField, AdminInput } from "./AdminField";

function isHttpImageUrl(url: string): boolean {
  const t = url.trim();
  return t.startsWith("data:image/") || /^https?:\/\//i.test(t);
}

export type ImageFieldValue = {
  image: string;
  imageOriginal?: string;
  imageFit?: ImageUploadFit;
};

export function ImageField({
  label,
  hint,
  value,
  imageOriginal = "",
  uploadFit = "cover",
  onChange,
  preset = "default",
  coverPreset,
  containPreset,
  uploadFitName = "image-upload-fit",
}: {
  label: string;
  hint?: string;
  value: string;
  imageOriginal?: string;
  uploadFit?: ImageUploadFit;
  onChange: (next: ImageFieldValue) => void;
  preset?: AdminImagePreset;
  coverPreset?: AdminImagePreset;
  containPreset?: AdminImagePreset;
  uploadFitName?: string;
}) {
  const hasFitChoice = Boolean(coverPreset && containPreset);
  const fit: ImageUploadFit = uploadFit;
  const uploadPreset = hasFitChoice
    ? presetForImageUploadFit(fit, coverPreset!, containPreset!)
    : preset;

  const presetLabel = ADMIN_IMAGE_PRESETS[uploadPreset].label;
  const defaultHint = isSupabaseConfigured
    ? hasFitChoice
      ? "「전체 표시」는 원본 비율 그대로(여백 보임), 「자르기」는 4:3에 꽉 차게 잘립니다. 클릭 즉시 미리보기에 반영됩니다."
      : `파일·URL은 ${presetLabel} 기준으로 처리됩니다. URL은 입력 후 다른 칸을 클릭하세요.`
    : "Supabase 연결 전에는 작은 이미지만 업로드 가능합니다.";

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null as string | null);
  const [draftUrl, setDraftUrl] = useState(value);
  const [previewFit, setPreviewFit] = useState<ImageUploadFit>(fit);
  const lastCommittedRef = useRef(value);

  useEffect(() => {
    setDraftUrl(value);
    lastCommittedRef.current = value;
  }, [value]);

  useEffect(() => {
    setPreviewFit(fit);
  }, [fit]);

  const previewSrc = resolveDisplayImage(
    draftUrl.trim() || value,
    imageOriginal,
    previewFit
  );
  const previewAspect = hasFitChoice
    ? "4/3"
    : previewAspectRatio(uploadPreset).replace(/ /g, "/");

  const patch = useCallback(
    (partial: Partial<ImageFieldValue>) => {
      onChange({
        image: partial.image ?? value,
        imageOriginal: partial.imageOriginal ?? imageOriginal,
        imageFit: partial.imageFit ?? fit,
      });
    },
    [onChange, value, imageOriginal, fit]
  );

  const commitPreparedImage = useCallback(
    async (
      prepare: () => Promise<File>,
      meta: { image: string; imageOriginal: string; imageFit: ImageUploadFit }
    ) => {
      setUploading(true);
      setError(null);
      try {
        const prepared = await prepare();
        const url = await uploadImage(prepared);
        lastCommittedRef.current = url;
        setDraftUrl(url);
        patch({
          image: url,
          imageOriginal: meta.imageOriginal,
          imageFit: meta.imageFit,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "이미지 처리 실패");
      } finally {
        setUploading(false);
      }
    },
    [patch]
  );

  const handleFitSelect = (nextFit: ImageUploadFit) => {
    if (!hasFitChoice) return;
    setPreviewFit(nextFit);
    patch({ imageFit: nextFit });

    if (nextFit === "contain") {
      return;
    }

    const source = (imageOriginal || value || draftUrl).trim();
    if (!source || !isHttpImageUrl(source)) return;

    lastCommittedRef.current = "";
    void commitPreparedImage(() => prepareImageFromUrl(source, coverPreset!), {
      image: "",
      imageOriginal: source,
      imageFit: "cover",
    });
  };

  const handleUrlBlur = async () => {
    const trimmed = draftUrl.trim();
    if (!trimmed) {
      patch({ image: "", imageOriginal: "", imageFit: fit });
      lastCommittedRef.current = "";
      return;
    }
    if (trimmed === lastCommittedRef.current) return;

    if (!isHttpImageUrl(trimmed)) {
      lastCommittedRef.current = trimmed;
      patch({ image: trimmed, imageOriginal: trimmed, imageFit: fit });
      return;
    }

    if (hasFitChoice && fit === "contain") {
      lastCommittedRef.current = trimmed;
      patch({
        image: trimmed,
        imageOriginal: trimmed,
        imageFit: "contain",
      });
      return;
    }

    lastCommittedRef.current = "";
    await commitPreparedImage(
      () => prepareImageFromUrl(trimmed, uploadPreset),
      { image: "", imageOriginal: trimmed, imageFit: fit }
    );
  };

  const handleFileUpload = async (file: File) => {
    if (!hasFitChoice) {
      await commitPreparedImage(
        () => prepareImageForUpload(file, uploadPreset),
        { image: "", imageOriginal: "", imageFit: fit }
      );
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const originalUrl = await uploadImage(file);

      if (fit === "contain") {
        lastCommittedRef.current = originalUrl;
        setDraftUrl(originalUrl);
        patch({
          image: originalUrl,
          imageOriginal: originalUrl,
          imageFit: "contain",
        });
        return;
      }

      const prepared = await prepareImageForUpload(file, coverPreset!);
      const croppedUrl = await uploadImage(prepared);
      lastCommittedRef.current = croppedUrl;
      setDraftUrl(croppedUrl);
      patch({
        image: croppedUrl,
        imageOriginal: originalUrl,
        imageFit: "cover",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지 처리 실패");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {hasFitChoice && (
        <AdminField label="업로드 방식">
          <div className="flex flex-col gap-2 text-sm">
            {IMAGE_UPLOAD_FIT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-2 cursor-pointer rounded-sm px-2 py-1.5 transition-colors ${
                  previewFit === opt.value
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <input
                  type="radio"
                  name={uploadFitName}
                  className="mt-1"
                  checked={previewFit === opt.value}
                  disabled={uploading}
                  onChange={() => handleFitSelect(opt.value)}
                />
                <span>
                  <span className="font-medium">{opt.label}</span>
                  <span className="block text-xs opacity-80">{opt.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </AdminField>
      )}

      <AdminField label={label} hint={hint ?? defaultHint}>
        <div className="flex flex-col sm:flex-row gap-4">
          {previewSrc ? (
            <div className="w-full sm:max-w-[280px] shrink-0 border border-border rounded-sm overflow-hidden">
              <FittedImage
                key={`${previewFit}-${previewSrc}`}
                src={previewSrc}
                fit={previewFit}
                aspectRatio={previewAspect}
              />
            </div>
          ) : null}
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
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors disabled:opacity-50">
              <Upload size={16} />
              {uploading
                ? previewFit === "cover"
                  ? "자르기·맞춤 중..."
                  : "업로드 중..."
                : "이미지 업로드"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFileUpload(f);
                  e.target.value = "";
                }}
              />
            </label>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </div>
      </AdminField>
    </div>
  );
}
