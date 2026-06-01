import type { ContactFormPayload } from "./contact-email";
import { getSupabaseServiceClient } from "./supabaseServer";

export async function saveInquiryRecord(payload: ContactFormPayload): Promise<void> {
  const client = getSupabaseServiceClient();
  if (!client) return;

  const { error } = await client.from("inquiries").insert({
    payload: {
      name: payload.name,
      company: payload.company ?? null,
      email: payload.email,
      phone: payload.phone ?? null,
      service: payload.service ?? null,
      message: payload.message,
      submitted_at: new Date().toISOString(),
    },
  });

  if (error) {
    console.warn("[inquiries] save skipped:", error.message);
  }
}
