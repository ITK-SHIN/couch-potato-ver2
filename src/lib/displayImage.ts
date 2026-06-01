import type { ImageUploadFit } from "../types/siteContent";

/** 화면 표시용 URL · cover=가공본, contain=원본 우선 */
export function resolveDisplayImage(
  image: string,
  imageOriginal: string | undefined,
  fit: ImageUploadFit
): string {
  if (fit === "contain") {
    return (imageOriginal?.trim() || image).trim();
  }
  return image.trim();
}
