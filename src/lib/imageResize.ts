export type AdminImagePreset =
  | "hero"
  | "highlight"
  | "about"
  | "process"
  | "portfolio"
  | "default";

type ImageFitMode = "cover" | "contain";

type PresetConfig = {
  label: string;
  aspectRatio: number;
  maxWidth: number;
  maxHeight: number;
  quality: number;
  mime: "image/jpeg" | "image/webp" | "image/png";
  fit: ImageFitMode;
  letterboxColor: string;
};

export const ADMIN_IMAGE_PRESETS: Record<AdminImagePreset, PresetConfig> = {
  hero: {
    label: "히어로 배경 (16:9)",
    aspectRatio: 16 / 9,
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    mime: "image/jpeg",
    fit: "cover",
    letterboxColor: "#0a0a0a",
  },
  highlight: {
    label: "하이라이트 카드 (16:10)",
    aspectRatio: 16 / 10,
    maxWidth: 1600,
    maxHeight: 1000,
    quality: 0.9,
    mime: "image/png",
    fit: "contain",
    letterboxColor: "#141414",
  },
  about: {
    label: "소개 이미지 (16:9)",
    aspectRatio: 16 / 9,
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.9,
    mime: "image/png",
    fit: "contain",
    letterboxColor: "#141414",
  },
  process: {
    label: "제작 과정 (4:3)",
    aspectRatio: 4 / 3,
    maxWidth: 1600,
    maxHeight: 1200,
    quality: 0.9,
    mime: "image/png",
    fit: "contain",
    letterboxColor: "#141414",
  },
  portfolio: {
    label: "포트폴리오 썸네일 (4:3)",
    aspectRatio: 4 / 3,
    maxWidth: 1280,
    maxHeight: 960,
    quality: 0.82,
    mime: "image/jpeg",
    fit: "cover",
    letterboxColor: "#0a0a0a",
  },
  default: {
    label: "일반",
    aspectRatio: 0,
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.9,
    mime: "image/png",
    fit: "contain",
    letterboxColor: "#141414",
  },
};

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 불러올 수 없습니다."));
    };
    img.src = url;
  });
}

function coverCropRect(srcW: number, srcH: number, targetAspect: number) {
  const sourceAspect = srcW / srcH;
  if (sourceAspect > targetAspect) {
    const sw = srcH * targetAspect;
    return { sx: (srcW - sw) / 2, sy: 0, sw, sh: srcH };
  }
  const sh = srcW / targetAspect;
  return { sx: 0, sy: (srcH - sh) / 2, sw: srcW, sh };
}

function outputSize(config: PresetConfig) {
  if (config.aspectRatio <= 0) {
    return { width: config.maxWidth, height: config.maxHeight };
  }
  let width = config.maxWidth;
  let height = Math.round(width / config.aspectRatio);
  if (height > config.maxHeight) {
    height = config.maxHeight;
    width = Math.round(height * config.aspectRatio);
  }
  return { width, height };
}

function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  bgColor: string
) {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
}

function mimeToExtension(mime: PresetConfig["mime"]) {
  if (mime === "image/webp") return "webp";
  if (mime === "image/png") return "png";
  return "jpg";
}

function imageElementToFile(
  img: HTMLImageElement,
  preset: AdminImagePreset,
  baseName: string
): Promise<File> {
  const config = ADMIN_IMAGE_PRESETS[preset];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("이미지 처리를 지원하지 않는 환경입니다.");

  if (config.aspectRatio > 0) {
    const { width, height } = outputSize(config);
    canvas.width = width;
    canvas.height = height;
    if (config.fit === "contain") {
      drawImageContain(ctx, img, width, height, config.letterboxColor);
    } else {
      const { sx, sy, sw, sh } = coverCropRect(
        img.naturalWidth,
        img.naturalHeight,
        config.aspectRatio
      );
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
    }
  } else {
    const scale = Math.min(
      config.maxWidth / img.naturalWidth,
      config.maxHeight / img.naturalHeight,
      1
    );
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (!b) {
          reject(new Error("이미지 변환에 실패했습니다."));
          return;
        }
        resolve(
          new File([b], `${baseName}-${preset}.${mimeToExtension(config.mime)}`, {
            type: config.mime,
          })
        );
      },
      config.mime,
      config.quality
    );
  });
}

export async function prepareImageForUpload(
  file: File,
  preset: AdminImagePreset = "default"
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }
  const img = await loadImageElement(file);
  const base = file.name.replace(/\.[^.]+$/, "") || "image";
  return imageElementToFile(img, preset, base);
}

async function fetchImageBlobViaProxy(imageUrl: string): Promise<Blob> {
  const res = await fetch(
    `/api/image-proxy?url=${encodeURIComponent(imageUrl.trim())}`
  );
  if (!res.ok) {
    let message = "이미지를 가져올 수 없습니다.";
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  const blob = await res.blob();
  if (!blob.type.startsWith("image/")) {
    throw new Error("이미지 파일이 아닌 URL입니다.");
  }
  return blob;
}

function shouldProcessImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("data:image/")) return true;
  return /^https?:\/\//i.test(trimmed);
}

async function dataUrlToFile(dataUrl: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  if (!blob.type.startsWith("image/")) {
    throw new Error("이미지 data URL이 아닙니다.");
  }
  const ext = blob.type.includes("png") ? "png" : "jpg";
  return new File([blob], `pasted.${ext}`, { type: blob.type });
}

export async function prepareImageFromUrl(
  imageUrl: string,
  preset: AdminImagePreset = "default"
): Promise<File> {
  const trimmed = imageUrl.trim();
  if (!shouldProcessImageUrl(trimmed)) {
    throw new Error("http(s) 또는 data:image URL을 입력해 주세요.");
  }
  const file = trimmed.startsWith("data:image/")
    ? await dataUrlToFile(trimmed)
    : new File([await fetchImageBlobViaProxy(trimmed)], "remote.jpg", {
        type: "image/jpeg",
      });
  return prepareImageForUpload(file, preset);
}

export function previewAspectRatio(preset: AdminImagePreset): string {
  const ar = ADMIN_IMAGE_PRESETS[preset].aspectRatio;
  if (ar <= 0) return "16 / 10";
  if (Math.abs(ar - 16 / 9) < 0.01) return "16 / 9";
  if (Math.abs(ar - 16 / 10) < 0.01) return "16 / 10";
  if (Math.abs(ar - 4 / 3) < 0.01) return "4 / 3";
  return `${ar}`;
}

export function previewObjectFit(preset: AdminImagePreset): "cover" | "contain" {
  const config = ADMIN_IMAGE_PRESETS[preset];
  if (config.aspectRatio <= 0) return "contain";
  return config.fit;
}
