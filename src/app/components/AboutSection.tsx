import { FittedImage } from "../../components/FittedImage";
import { useSiteContentDisplay } from "../../context/SiteContentDisplayContext";
import { resolveDisplayImage } from "../../lib/displayImage";
import type { ImageUploadFit } from "../../types/siteContent";

export function AboutSection() {
  const content = useSiteContentDisplay();
  const about = content.about;
  const imageFit: ImageUploadFit = about.imageFit ?? "contain";
  const displaySrc = resolveDisplayImage(about.image, about.imageOriginal, imageFit);

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-20">
          <span
            className="text-primary"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", letterSpacing: "0.3em" }}
          >
            ABOUT
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div>
            <h2
              className="text-foreground mb-6 leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
            >
              {about.heading}
            </h2>
            <p className="text-muted-foreground leading-relaxed" style={{ fontSize: "1.05rem" }}>
              {about.intro}
            </p>
          </div>
          <div>
            <h3 className="text-foreground mb-4" style={{ fontSize: "1.2rem", fontWeight: 600 }}>
              {about.philosophyTitle}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{about.philosophy1}</p>
            <p className="text-muted-foreground leading-relaxed">{about.philosophy2}</p>
            <div className="mt-6 w-12 h-0.5 bg-primary" />
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8 mb-24">
          <div className="md:col-span-3 relative">
            <FittedImage
              key={`${displaySrc}-${imageFit}`}
              src={displaySrc}
              alt="편집 스튜디오"
              fit={imageFit}
              aspectRatio="16/9"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </div>
          <div className="md:col-span-2 flex flex-col justify-between py-4">
            <div>
              <h3 className="text-foreground mb-6" style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                {about.strengthsTitle}
              </h3>
              <ul className="space-y-3">
                {about.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground" style={{ fontSize: "0.95rem" }}>
                    <span className="text-primary mt-0.5 shrink-0">—</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground text-sm tracking-widest uppercase mb-8" style={{ letterSpacing: "0.2em" }}>
            {about.fieldsTitle}
          </h3>
          <div className="flex flex-wrap gap-3">
            {about.fields.map((f, i) => (
              <span
                key={i}
                className="border border-border text-foreground px-5 py-2 text-sm hover:border-primary hover:text-primary transition-colors cursor-default"
                style={{ borderRadius: "2px" }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
