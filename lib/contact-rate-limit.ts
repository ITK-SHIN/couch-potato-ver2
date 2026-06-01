export type ContactRateLimitEnv = {
  CONTACT_RATE_LIMIT_MAX?: string;
  CONTACT_RATE_LIMIT_WINDOW_MIN?: string;
  CONTACT_RATE_LIMIT_COOLDOWN_SEC?: string;
};

export class ContactRateLimitError extends Error {
  readonly retryAfterSec: number;

  constructor(message: string, retryAfterSec: number) {
    super(message);
    this.name = "ContactRateLimitError";
    this.retryAfterSec = retryAfterSec;
  }
}

type RateLimitEntry = {
  count: number;
  windowEndsAt: number;
  lastRequestAt: number;
};

const STORE_KEY = "__couchpotatoContactRateLimit__";

const DEFAULT_MAX = 5;
const DEFAULT_WINDOW_MIN = 60;
const DEFAULT_COOLDOWN_SEC = 60;

function getStore(): Map<string, RateLimitEntry> {
  const g = globalThis as typeof globalThis & {
    [STORE_KEY]?: Map<string, RateLimitEntry>;
  };
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = new Map();
  }
  return g[STORE_KEY];
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function getLimits(env: ContactRateLimitEnv) {
  return {
    max: parsePositiveInt(env.CONTACT_RATE_LIMIT_MAX, DEFAULT_MAX),
    windowMs:
      parsePositiveInt(env.CONTACT_RATE_LIMIT_WINDOW_MIN, DEFAULT_WINDOW_MIN) *
      60 *
      1000,
    cooldownMs:
      parsePositiveInt(env.CONTACT_RATE_LIMIT_COOLDOWN_SEC, DEFAULT_COOLDOWN_SEC) *
      1000,
  };
}

function pruneExpiredEntries(store: Map<string, RateLimitEntry>, now: number) {
  if (store.size < 500) return;
  for (const [ip, entry] of store) {
    if (entry.windowEndsAt <= now) {
      store.delete(ip);
    }
  }
}

export function getClientIpFromRequest(request: Request): string {
  return extractIp({
    "x-forwarded-for": request.headers.get("x-forwarded-for"),
    "x-real-ip": request.headers.get("x-real-ip"),
    "cf-connecting-ip": request.headers.get("cf-connecting-ip"),
  });
}

export function getClientIpFromNodeHeaders(
  headers: Record<string, string | string[] | undefined>,
  fallback = "127.0.0.1"
): string {
  const ip = extractIp({
    "x-forwarded-for": headerValue(headers["x-forwarded-for"]),
    "x-real-ip": headerValue(headers["x-real-ip"]),
    "cf-connecting-ip": headerValue(headers["cf-connecting-ip"]),
  });
  return ip === "unknown" ? fallback : ip;
}

function headerValue(value: string | string[] | undefined): string | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] : value;
}

function extractIp(headers: Record<string, string | null>): string {
  const forwarded = headers["x-forwarded-for"];
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headers["x-real-ip"]?.trim();
  if (real) return real;
  const cf = headers["cf-connecting-ip"]?.trim();
  if (cf) return cf;
  return "unknown";
}

export function assertContactRateLimit(
  ip: string,
  env: ContactRateLimitEnv = process.env as ContactRateLimitEnv
): void {
  const clientIp = ip.trim() || "unknown";
  const { max, windowMs, cooldownMs } = getLimits(env);
  const now = Date.now();
  const store = getStore();

  pruneExpiredEntries(store, now);

  let entry = store.get(clientIp);

  if (!entry || entry.windowEndsAt <= now) {
    entry = {
      count: 0,
      windowEndsAt: now + windowMs,
      lastRequestAt: 0,
    };
  }

  if (entry.lastRequestAt > 0 && now - entry.lastRequestAt < cooldownMs) {
    const retryAfterSec = Math.ceil(
      (cooldownMs - (now - entry.lastRequestAt)) / 1000
    );
    throw new ContactRateLimitError(
      `요청이 너무 빠릅니다. ${retryAfterSec}초 후에 다시 시도해 주세요.`,
      retryAfterSec
    );
  }

  if (entry.count >= max) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((entry.windowEndsAt - now) / 1000)
    );
    throw new ContactRateLimitError(
      `같은 네트워크에서 문의 횟수 제한(${max}회/${Math.round(windowMs / 60000)}분)을 초과했습니다. ${retryAfterSec}초 후에 다시 시도해 주세요.`,
      retryAfterSec
    );
  }

  entry.count += 1;
  entry.lastRequestAt = now;
  store.set(clientIp, entry);
}
