const MAX_BYTES = 15 * 1024 * 1024;

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local")) return true;
  if (h === "127.0.0.1" || h === "::1" || h === "0.0.0.0") return true;
  if (/^10\.\d+\.\d+\.\d+$/.test(h)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(h)) return true;
  return false;
}

export function assertSafeImageUrl(urlString: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(urlString.trim());
  } catch {
    throw new Error("올바른 이미지 URL이 아닙니다.");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("http 또는 https URL만 사용할 수 있습니다.");
  }
  if (isPrivateHost(parsed.hostname)) {
    throw new Error("내부 주소는 사용할 수 없습니다.");
  }
  return parsed;
}

export async function fetchRemoteImageBuffer(
  urlString: string
): Promise<{ buffer: ArrayBuffer; contentType: string }> {
  const parsed = assertSafeImageUrl(urlString);
  const res = await fetch(parsed.toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; CouchPotatoCMS/1.0)",
      Accept: "image/*,*/*;q=0.8",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`이미지를 가져올 수 없습니다. (${res.status})`);
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  if (!contentType.startsWith("image/")) {
    throw new Error("이미지 파일이 아닌 URL입니다.");
  }
  const buffer = await res.arrayBuffer();
  if (buffer.byteLength > MAX_BYTES) {
    throw new Error("이미지 용량이 15MB를 초과합니다.");
  }
  return { buffer, contentType };
}
