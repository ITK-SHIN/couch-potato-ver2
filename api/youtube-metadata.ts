import { fetchYoutubeMetadataFromWatchPage } from "../lib/youtube-metadata";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "GET") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders }
    );
  }

  const url = new URL(request.url);
  const videoId = url.searchParams.get("v")?.trim();
  if (!videoId) {
    return Response.json(
      { error: "v (video id) required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const meta = await fetchYoutubeMetadataFromWatchPage(videoId);
  return Response.json(meta, { headers: corsHeaders });
}
