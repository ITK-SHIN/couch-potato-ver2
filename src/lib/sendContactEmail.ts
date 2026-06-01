import type { ContactFormPayload } from "../../lib/contact-email";

async function parseErrorResponse(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const data = JSON.parse(text) as { error?: string };
    if (data.error) return data.error;
  } catch {
    /* not JSON — Vercel/서버 기본 오류 페이지 */
  }
  if (res.status === 404) {
    return "문의 API를 찾을 수 없습니다. Vercel 재배포 후 다시 시도해 주세요.";
  }
  if (res.status >= 500) {
    return "서버 오류가 발생했습니다. Vercel에 RESEND_API_KEY 등 환경 변수가 설정됐는지 확인해 주세요.";
  }
  return "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.";
}

export async function sendContactEmail(payload: ContactFormPayload): Promise<void> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
  if (!data.ok) {
    throw new Error("문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  }
}
