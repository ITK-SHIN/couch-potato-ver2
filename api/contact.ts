import { handleContactSubmission, type ContactFormPayload } from "../lib/contact-email";
import {
  assertContactRateLimit,
  ContactRateLimitError,
  getClientIpFromRequest,
} from "../lib/contact-rate-limit";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    assertContactRateLimit(getClientIpFromRequest(request), process.env);

    const body = (await request.json()) as ContactFormPayload;
    await handleContactSubmission(body, process.env);
    return Response.json({ ok: true }, { headers: corsHeaders });
  } catch (err) {
    if (err instanceof ContactRateLimitError) {
      return Response.json(
        { error: err.message },
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Retry-After": String(err.retryAfterSec),
          },
        }
      );
    }

    const message =
      err instanceof Error ? err.message : "이메일 전송에 실패했습니다.";
    return Response.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
