import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { PortfolioItem, PortfolioVideoType } from "../../types/siteContent";
import { fetchYoutubeVideoMetadata } from "../../lib/portfolioYoutubeImport";
import { getYoutubeThumbnail, parseYoutubeId } from "../../lib/youtube";
import { AdminField, AdminInput, adminInputClass } from "./AdminField";
import { ImageField } from "./ImageField";
import { VideoField } from "./VideoField";
import { PortfolioCategorySelect } from "./PortfolioCategorySelect";

type Props = {
  item: PortfolioItem;
  categories: string[];
  onChange: (item: PortfolioItem) => void;
  /** YouTube URL 입력 시 썸네일·제목·재생 시간·채널명 자동 반영 */
  autoYoutubeMetadata?: boolean;
};

export function PortfolioItemFormFields({
  item,
  categories,
  onChange,
  autoYoutubeMetadata = false,
}: Props) {
  const [metadataLoading, setMetadataLoading] = useState(false);
  const fetchGenRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRef = useRef(item);
  itemRef.current = item;

  const patch = (partial: Partial<PortfolioItem>) =>
    onChange({ ...item, ...partial });

  const applyYoutubeMetadata = async (url: string, current: PortfolioItem) => {
    const partial: Partial<PortfolioItem> = { youtubeUrl: url };
    const id = parseYoutubeId(url);
    if (!id) {
      onChange({ ...current, ...partial });
      return;
    }

    partial.image = getYoutubeThumbnail(id);
    onChange({ ...current, ...partial });

    if (!autoYoutubeMetadata) return;

    const gen = ++fetchGenRef.current;
    setMetadataLoading(true);
    try {
      const meta = await fetchYoutubeVideoMetadata(id);
      if (!meta || gen !== fetchGenRef.current) return;
      if (parseYoutubeId(current.youtubeUrl ?? "") !== id) return;

      onChange({
        ...current,
        youtubeUrl: url,
        image: meta.image,
        title: meta.title || current.title,
        duration: meta.duration || current.duration,
        client: current.client.trim() ? current.client : meta.client,
      });
    } finally {
      if (gen === fetchGenRef.current) setMetadataLoading(false);
    }
  };

  const scheduleYoutubeFetch = (url: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const partial: Partial<PortfolioItem> = { youtubeUrl: url };
    const id = parseYoutubeId(url);
    if (id && autoYoutubeMetadata) {
      partial.image = getYoutubeThumbnail(id);
    }
    onChange({ ...item, ...partial });

    if (!autoYoutubeMetadata || !id) return;

    debounceRef.current = setTimeout(() => {
      void applyYoutubeMetadata(url, itemRef.current);
    }, 500);
  };

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const categoryField = (
    <PortfolioCategorySelect
      label="카테고리"
      categories={categories}
      value={item.category}
      onChange={(category) => patch({ category })}
    />
  );

  const titleField = (
    <AdminField
      label="제목"
      hint={autoYoutubeMetadata ? "YouTube URL 입력 시 자동 채워집니다." : "필수"}
    >
      <AdminInput
        value={item.title}
        placeholder="작품 제목"
        onChange={(e) => patch({ title: e.target.value })}
      />
    </AdminField>
  );

  const clientField = (
    <AdminField label="클라이언트">
      <AdminInput
        value={item.client}
        placeholder="클라이언트명 (선택)"
        onChange={(e) => patch({ client: e.target.value })}
      />
    </AdminField>
  );

  const durationField = (
    <AdminField
      label="재생 시간"
      hint={autoYoutubeMetadata ? "YouTube URL 입력 시 자동 채워집니다." : undefined}
    >
      <AdminInput
        value={item.duration}
        placeholder="예: 3:24"
        onChange={(e) => patch({ duration: e.target.value })}
      />
    </AdminField>
  );

  const videoTypeField = (
    <AdminField label="영상 종류">
      <select
        value={item.videoType ?? "none"}
        className={adminInputClass}
        onChange={(e) => {
          const videoType = e.target.value as PortfolioVideoType;
          const partial: Partial<PortfolioItem> = {
            videoType,
            youtubeUrl: videoType === "youtube" ? item.youtubeUrl ?? "" : "",
            videoUrl: videoType === "upload" ? item.videoUrl ?? "" : "",
          };
          if (autoYoutubeMetadata && videoType === "youtube" && item.youtubeUrl) {
            const id = parseYoutubeId(item.youtubeUrl);
            if (id) partial.image = getYoutubeThumbnail(id);
          }
          patch(partial);
          if (autoYoutubeMetadata && videoType === "youtube" && item.youtubeUrl) {
            void applyYoutubeMetadata(item.youtubeUrl, { ...item, ...partial });
          }
        }}
      >
        <option value="none">없음 (썸네일만)</option>
        <option value="youtube">YouTube (권장)</option>
        <option value="upload">영상 업로드 (Supabase)</option>
      </select>
    </AdminField>
  );

  const showYoutubeUrl =
    autoYoutubeMetadata || item.videoType === "youtube";

  const youtubeUrlField = showYoutubeUrl && (
    <>
      <AdminField
        label="YouTube URL"
        hint={
          autoYoutubeMetadata
            ? "먼저 URL을 입력하세요. 제목·재생 시간·썸네일·채널명이 자동 적용됩니다."
            : "watch, youtu.be, shorts 링크 또는 11자리 영상 ID"
        }
      >
        <AdminInput
          value={item.youtubeUrl ?? ""}
          placeholder="https://www.youtube.com/watch?v=..."
          onChange={(e) => scheduleYoutubeFetch(e.target.value)}
          onBlur={(e) => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            void applyYoutubeMetadata(e.target.value, itemRef.current);
          }}
        />
      </AdminField>
      {metadataLoading && (
        <p className="text-xs text-muted-foreground">YouTube 정보 불러오는 중…</p>
      )}
      {!autoYoutubeMetadata && (
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          onClick={() => {
            const id = parseYoutubeId(item.youtubeUrl ?? "");
            if (!id) {
              toast.error("올바른 YouTube URL을 입력해 주세요.");
              return;
            }
            patch({ image: getYoutubeThumbnail(id) });
            toast.success("YouTube 썸네일을 적용했습니다.");
          }}
        >
          YouTube 썸네일 적용
        </button>
      )}
    </>
  );

  const uploadField = item.videoType === "upload" && (
    <VideoField
      label="영상 파일 (MP4/WebM)"
      value={item.videoUrl ?? ""}
      onChange={(url) => patch({ videoUrl: url })}
    />
  );

  const thumbnailField = (
    <ImageField
      label="썸네일"
      hint={
        autoYoutubeMetadata && item.videoType === "youtube"
          ? "YouTube URL과 함께 자동 설정됩니다. 필요 시 직접 변경할 수 있습니다."
          : undefined
      }
      value={item.image}
      onChange={(next) => patch({ image: next.image })}
    />
  );

  if (autoYoutubeMetadata) {
    return (
      <div className="space-y-3">
        {youtubeUrlField}
        {categoryField}
        {titleField}
        {clientField}
        {durationField}
        {videoTypeField}
        {uploadField}
        {thumbnailField}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categoryField}
      {titleField}
      {clientField}
      {durationField}
      {videoTypeField}
      {youtubeUrlField}
      {uploadField}
      {thumbnailField}
    </div>
  );
}
