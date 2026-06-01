import { Resend } from "resend";

export type ContactFormPayload = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  /** honeypot — 값이 있으면 봇으로 간주 */
  website?: string;
};

export type ContactEmailEnv = {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
};

const DEFAULT_TO = "bano112@naver.com";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function handleContactSubmission(
  payload: ContactFormPayload,
  env: ContactEmailEnv
): Promise<void> {
  if (payload.website?.trim()) {
    return;
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "이메일 API 키가 설정되지 않았습니다. RESEND_API_KEY를 .env 또는 Vercel에 추가해 주세요."
    );
  }

  if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
    throw new Error("필수 항목을 모두 입력해 주세요.");
  }

  const email = payload.email.trim();
  if (!EMAIL_REGEX.test(email)) {
    throw new Error("올바른 이메일 주소를 입력해 주세요. (예: name@example.com)");
  }

  const to = env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO;
  const from =
    env.CONTACT_FROM_EMAIL?.trim() || "COUCHPOTATO <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const subject = `[COUCHPOTATO 문의] ${payload.name}${
    payload.company ? ` · ${payload.company}` : ""
  }`;

  const html = `
    <h2>새 제작 문의</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="padding:8px 12px;color:#666;">이름</td><td style="padding:8px 12px;"><strong>${escapeHtml(payload.name)}</strong></td></tr>
      <tr><td style="padding:8px 12px;color:#666;">회사명</td><td style="padding:8px 12px;">${escapeHtml(payload.company || "-")}</td></tr>
      <tr><td style="padding:8px 12px;color:#666;">이메일</td><td style="padding:8px 12px;"><a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></td></tr>
      <tr><td style="padding:8px 12px;color:#666;">연락처</td><td style="padding:8px 12px;">${escapeHtml(payload.phone || "-")}</td></tr>
      <tr><td style="padding:8px 12px;color:#666;">필요 서비스</td><td style="padding:8px 12px;">${escapeHtml(payload.service || "-")}</td></tr>
    </table>
    <h3 style="margin-top:24px;">문의 내용</h3>
    <p style="white-space:pre-wrap;line-height:1.6;">${escapeHtml(payload.message)}</p>
  `;

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject,
    html,
  });

  if (error) {
    const msg = error.message || "이메일 전송에 실패했습니다.";
    const lower = msg.toLowerCase();
    if (
      lower.includes("only send") ||
      lower.includes("verify a domain") ||
      lower.includes("testing emails")
    ) {
      throw new Error(
        "Resend 테스트 발신 주소로는 가입 이메일로만 보낼 수 있습니다. Resend에서 도메인을 인증한 뒤 CONTACT_FROM_EMAIL을 해당 도메인 주소로 바꿔 주세요. (CONTACT_EMAIL.md 참고)"
      );
    }
    throw new Error(msg);
  }

  const { saveInquiryRecord } = await import("./saveInquiry");
  await saveInquiryRecord(payload);
}
