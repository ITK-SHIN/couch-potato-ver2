import {
  allowSearchIndexingFromEnv,
  getSiteUrlFromEnv,
} from "../lib/siteConfig";

export default function handler(): Response {
  const base = getSiteUrlFromEnv();
  const indexable = allowSearchIndexingFromEnv();

  const lines = indexable
    ? [
        "User-agent: *",
        "Allow: /",
        base ? `Sitemap: ${base}/api/sitemap` : "",
      ]
    : ["User-agent: *", "Disallow: /"];

  return new Response(lines.filter(Boolean).join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
