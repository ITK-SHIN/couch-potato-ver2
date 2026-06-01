import { fetchRemoteImageBuffer } from "../lib/image-proxy";

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
  const url = new URL(request.url).searchParams.get("url")?.trim();
  if (!url) {
    return Response.json(
      { error: "url required" },
      { status: 400, headers: corsHeaders }
    );
  }
  try {
    const { buffer, contentType } = await fetchRemoteImageBuffer(url);
    return new Response(buffer, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": contentType },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "fetch failed";
    return Response.json({ error: message }, { status: 400, headers: corsHeaders });
  }
}
