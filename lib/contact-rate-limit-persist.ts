import {
  ContactRateLimitError,
  type ContactRateLimitEnv,
  getLimits,
} from "./contact-rate-limit";
import { getSupabaseServiceClient } from "./supabaseServer";

type RateRow = {
  ip_hash: string;
  count: number;
  window_ends_at: string;
  last_request_at: string;
};

function hashIp(ip: string): string {
  return `ip:${ip.trim() || "unknown"}`;
}

export async function assertContactRateLimitPersist(
  ip: string,
  env: ContactRateLimitEnv = process.env as ContactRateLimitEnv
): Promise<void> {
  const client = getSupabaseServiceClient();
  if (!client) return;

  const clientIp = ip.trim() || "unknown";
  const ipHash = hashIp(clientIp);
  const { max, windowMs, cooldownMs } = getLimits(env);
  const now = Date.now();
  const nowIso = new Date(now).toISOString();

  const { data: existing, error: readError } = await client
    .from("contact_rate_limits")
    .select("ip_hash, count, window_ends_at, last_request_at")
    .eq("ip_hash", ipHash)
    .maybeSingle();

  if (readError) {
    console.warn("[rate-limit] read failed, skipping persist:", readError.message);
    return;
  }

  let entry: RateRow | null = existing as RateRow | null;
  const windowEndsAt = entry ? new Date(entry.window_ends_at).getTime() : 0;

  if (!entry || windowEndsAt <= now) {
    entry = {
      ip_hash: ipHash,
      count: 0,
      window_ends_at: new Date(now + windowMs).toISOString(),
      last_request_at: new Date(0).toISOString(),
    };
  }

  const lastAt = new Date(entry.last_request_at).getTime();
  if (lastAt > 0 && now - lastAt < cooldownMs) {
    const retryAfterSec = Math.ceil((cooldownMs - (now - lastAt)) / 1000);
    throw new ContactRateLimitError(
      `요청이 너무 빠릅니다. ${retryAfterSec}초 후에 다시 시도해 주세요.`,
      retryAfterSec
    );
  }

  if (entry.count >= max) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((new Date(entry.window_ends_at).getTime() - now) / 1000)
    );
    throw new ContactRateLimitError(
      `같은 네트워크에서 문의 횟수 제한(${max}회/${Math.round(windowMs / 60000)}분)을 초과했습니다. ${retryAfterSec}초 후에 다시 시도해 주세요.`,
      retryAfterSec
    );
  }

  const next: RateRow = {
    ip_hash: ipHash,
    count: entry.count + 1,
    window_ends_at: entry.window_ends_at,
    last_request_at: nowIso,
  };

  const { error: writeError } = await client
    .from("contact_rate_limits")
    .upsert(next, { onConflict: "ip_hash" });

  if (writeError) {
    console.warn("[rate-limit] write failed:", writeError.message);
  }
}
