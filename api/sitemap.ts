import {
  allowSearchIndexingFromEnv,
  getSiteUrlFromEnv,
} from "../lib/siteConfig";

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(): Promise<Response> {
  const base = getSiteUrlFromEnv() || "https://example.com";
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = [
    { loc: `${base}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${base}/#about`, changefreq: "monthly", priority: "0.8" },
    { loc: `${base}/#portfolio`, changefreq: "weekly", priority: "0.9" },
    { loc: `${base}/#contact`, changefreq: "monthly", priority: "0.7" },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  const headers: Record<string, string> = {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  };

  if (!allowSearchIndexingFromEnv()) {
    headers["X-Robots-Tag"] = "noindex";
  }

  return new Response(body, { status: 200, headers });
}
