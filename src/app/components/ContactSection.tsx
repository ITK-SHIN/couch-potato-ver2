import { useState } from "react";
import {
  Mail,
  Phone,
  Instagram,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { useSiteContentDisplay } from "../../context/SiteContentDisplayContext";
import { trackEvent } from "../../lib/analytics";
import { sendContactEmail } from "../../lib/sendContactEmail";

const emptyForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  message: "",
  website: "",
};

export function ContactSection() {
  const content = useSiteContentDisplay();
  const c = content.contact;
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      await sendContactEmail({
        name: form.name.trim(),
        company: form.company.trim() || undefined,
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        service: form.service || undefined,
        message: form.message.trim(),
        website: form.website,
      });
      trackEvent("contact_submit", { method: "form" });
      setSubmitted(true);
      setForm(emptyForm);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const successLines = c.successMessage.split("\n");

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span className="section-label">CONTACT</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="mb-16">
          <h2 className="section-title text-foreground mb-4">{c.title}</h2>
          <p className="text-muted-foreground">{c.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-5 gap-16">
          <div className="md:col-span-2 flex flex-col gap-10">
            <div>
              <h3
                className="text-foreground mb-6 text-sm tracking-widest uppercase"
                style={{ letterSpacing: "0.2em" }}
              >
                연락처
              </h3>
              <ul className="space-y-5">
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">이메일</p>
                    <p className="text-foreground text-sm">{c.email}</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">전화</p>
                    <p className="text-foreground text-sm">{c.phone}</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
                    <Instagram size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">인스타그램</p>
                    <p className="text-foreground text-sm">{c.instagram}</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
                    <MessageCircle size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">카카오톡 채널</p>
                    <p className="text-foreground text-sm">{c.kakao}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-muted p-6" style={{ borderRadius: "2px" }}>
              <p
                className="text-primary text-xs tracking-wider uppercase mb-2"
                style={{ letterSpacing: "0.15em" }}
              >
                {c.responseTitle}
              </p>
              <p className="text-foreground text-sm leading-relaxed">{c.responseText}</p>
            </div>
          </div>

          <div className="md:col-span-3">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <CheckCircle size={48} className="text-primary mb-6" />
                <h3 className="text-foreground mb-3" style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                  {c.successTitle}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {successLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < successLines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSubmitError(null);
                  }}
                  className="mt-8 border border-border text-muted-foreground px-6 py-2 text-sm hover:border-primary hover:text-primary transition-all"
                  style={{ borderRadius: "2px" }}
                >
                  다시 문의하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-muted-foreground text-xs mb-2 tracking-wider">
                      이름 *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-muted border border-border text-foreground px-4 py-3 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/40"
                      style={{ borderRadius: "2px" }}
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground text-xs mb-2 tracking-wider">
                      회사명
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full bg-muted border border-border text-foreground px-4 py-3 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/40"
                      style={{ borderRadius: "2px" }}
                      placeholder="(주)카우치포테이토"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-muted-foreground text-xs mb-2 tracking-wider">
                      이메일 *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-muted border border-border text-foreground px-4 py-3 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/40"
                      style={{ borderRadius: "2px" }}
                      placeholder="hello@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground text-xs mb-2 tracking-wider">
                      연락처
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-muted border border-border text-foreground px-4 py-3 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/40"
                      style={{ borderRadius: "2px" }}
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-muted-foreground text-xs mb-2 tracking-wider">
                    필요 서비스
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {c.formServices.map((svc) => (
                      <button
                        type="button"
                        key={svc}
                        onClick={() => setForm({ ...form, service: svc })}
                        className={`px-4 py-2 text-xs transition-all ${
                          form.service === svc
                            ? "bg-primary text-primary-foreground"
                            : "border border-border text-muted-foreground hover:text-foreground"
                        }`}
                        style={{ borderRadius: "2px" }}
                      >
                        {svc}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-muted-foreground text-xs mb-2 tracking-wider">
                    문의 내용 *
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full bg-muted border border-border text-foreground px-4 py-3 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/40 resize-none"
                    style={{ borderRadius: "2px" }}
                    placeholder="프로젝트에 대해 간단히 소개해 주세요."
                  />
                </div>
                {submitError && (
                  <p className="text-destructive text-sm text-center">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-primary-foreground py-4 text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderRadius: "2px" }}
                >
                  {submitting ? "전송 중..." : "문의 보내기"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
