import type { ImageUploadFit } from "../types/siteContent";

type Props = {
  src: string;
  alt?: string;
  fit: ImageUploadFit;
  /** CSS aspect-ratio (예: "4/3", "16/9") */
  aspectRatio?: string;
  className?: string;
  imgClassName?: string;
};

/** 고정 비율 영역 안에서 cover(자르기·꽉 차게) / contain(전체 표시) */
export function FittedImage({
  src,
  alt = "",
  fit,
  aspectRatio = "4/3",
  className = "",
  imgClassName = "",
}: Props) {
  return (
    <div
      className={`relative overflow-hidden ${
        fit === "contain" ? "bg-[#141414]" : "bg-muted"
      } ${className}`}
      style={{ aspectRatio }}
    >
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-center transition-all duration-300 ${
          fit === "contain" ? "object-contain" : "object-cover"
        } ${imgClassName}`}
      />
    </div>
  );
}
