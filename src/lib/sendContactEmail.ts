import type { ContactFormPayload } from "../../lib/contact-email";

export async function sendContactEmail(payload: ContactFormPayload): Promise<void> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(data.error || "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  }
}
