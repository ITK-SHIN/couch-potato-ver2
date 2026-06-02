import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { BrandLogo } from "../../components/BrandLogo";
import { useSiteContentDisplay } from "../../context/SiteContentDisplayContext";

const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

export function Footer() {
  const content = useSiteContentDisplay();
  const f = content.footer;
  const taglineLines = f.tagline.split("\n");

  return (
    <footer id="footer" className="border-t border-border bg-secondary/30 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <h3 className="mb-5">
              <BrandLogo variant="footer" />
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              {taglineLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < taglineLines.length - 1 && <br />}
                </span>
              ))}
            </p>
            <button
              type="button"
              onClick={() => scrollTo("#contact")}
              className="bg-primary text-primary-foreground px-6 py-3 text-sm tracking-wider hover:bg-primary/90 transition-colors"
              style={{ borderRadius: "2px" }}
            >
              {f.ctaButton}
            </button>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16 lg:gap-20">
            <ul className="space-y-5">
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0 bg-background/50">
                  <Mail size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">이메일</p>
                  <a
                    href={`mailto:${f.email}`}
                    className="text-foreground text-sm hover:text-primary transition-colors"
                  >
                    {f.email}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0 bg-background/50">
                  <Phone size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">전화</p>
                  <a
                    href={`tel:${f.phone.replace(/[^0-9+]/g, "")}`}
                    className="text-foreground text-sm hover:text-primary transition-colors"
                  >
                    {f.phone}
                  </a>
                </div>
              </li>
            </ul>

            <div>
              <p
                className="text-muted-foreground text-xs tracking-widest uppercase mb-4"
                style={{ letterSpacing: "0.2em" }}
              >
                Follow
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-background/50"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="#"
                  aria-label="카카오톡"
                  className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-background/50"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
              <p className="text-muted-foreground text-xs mt-4">{f.instagramHandle}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-muted-foreground text-xs">{f.copyright}</p>
          <p className="text-muted-foreground text-xs tracking-wide">{f.taglineBottom}</p>
        </div>
      </div>
    </footer>
  );
}
