import { defineConfig, loadEnv, type Connect } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {
  handleContactSubmission,
  type ContactFormPayload,
} from "./lib/contact-email";
import {
  assertContactRateLimit,
  ContactRateLimitError,
  getClientIpFromNodeHeaders,
} from "./lib/contact-rate-limit";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

function contactApiDevMiddleware(
  env: Record<string, string>
): Connect.NextHandleFunction {
  return (req, res, next) => {
    const url = req.url?.split("?")[0];
    if (url !== "/api/contact") {
      next();
      return;
    }

    const sendJson = (status: number, body: object) => {
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(body));
    };

    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (req.method !== "POST") {
      sendJson(405, { error: "Method not allowed" });
      return;
    }

    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", async () => {
      try {
        const clientIp = getClientIpFromNodeHeaders(
          req.headers,
          req.socket.remoteAddress
        );
        assertContactRateLimit(clientIp, {
          CONTACT_RATE_LIMIT_MAX: env.CONTACT_RATE_LIMIT_MAX,
          CONTACT_RATE_LIMIT_WINDOW_MIN: env.CONTACT_RATE_LIMIT_WINDOW_MIN,
          CONTACT_RATE_LIMIT_COOLDOWN_SEC: env.CONTACT_RATE_LIMIT_COOLDOWN_SEC,
        });

        const raw = Buffer.concat(chunks).toString("utf8");
        const payload = JSON.parse(raw) as ContactFormPayload;
        await handleContactSubmission(payload, {
          RESEND_API_KEY: env.RESEND_API_KEY,
          CONTACT_TO_EMAIL: env.CONTACT_TO_EMAIL,
          CONTACT_FROM_EMAIL: env.CONTACT_FROM_EMAIL,
        });
        sendJson(200, { ok: true });
      } catch (err) {
        if (err instanceof ContactRateLimitError) {
          res.setHeader("Retry-After", String(err.retryAfterSec));
          sendJson(429, { error: err.message });
          return;
        }
        const message =
          err instanceof Error ? err.message : "이메일 전송에 실패했습니다.";
        sendJson(500, { error: message });
      }
    });
    req.on("error", () => {
      sendJson(500, { error: "요청 처리 중 오류가 발생했습니다." });
    });
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      figmaAssetResolver(),
      react(),
      tailwindcss(),
      {
        name: "dev-contact-api",
        configureServer(server) {
          server.middlewares.use(contactApiDevMiddleware(env));
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    assetsInclude: ["**/*.svg", "**/*.csv"],
  };
});
