export function getSiteUrlFromEnv(): string {
  const fromEnv = process.env.VITE_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "";
}

export function allowSearchIndexingFromEnv(): boolean {
  const flag = process.env.VITE_ALLOW_INDEXING?.trim().toLowerCase();
  if (flag === "false" || flag === "0" || flag === "no") return false;
  return true;
}
