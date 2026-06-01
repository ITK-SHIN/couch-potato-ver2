import { useState } from "react";
import { FittedImage } from "../../components/FittedImage";
import { useSiteContentDisplay } from "../../context/SiteContentDisplayContext";
import { resolveDisplayImage } from "../../lib/displayImage";
import type { ImageUploadFit } from "../../types/siteContent";

export function ProcessSection() {
  const content = useSiteContentDisplay();
  const { title, subtitle, steps } = content.process;
  const [active, setActive] = useState(0);
  const step = steps[active];
  const imageFit: ImageUploadFit = step?.imageFit ?? "cover";
  const displaySrc = step
    ? resolveDisplayImage(step.image, step.imageOriginal, imageFit)
    : "";

  return (
    <section id="process" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span
            className="text-primary"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", letterSpacing: "0.3em" }}
          >
            PROCESS
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="mb-16">
          <h2
            className="text-foreground leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
          >
            {title}
          </h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex gap-1 mb-12 flex-wrap">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`px-6 py-3 text-sm transition-all duration-200 ${
                active === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              style={{ borderRadius: "2px" }}
            >
              <span className="text-xs opacity-60 mr-1">{s.num}</span> {s.title}
            </button>
          ))}
        </div>

        {step && (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <FittedImage
                key={`${displaySrc}-${imageFit}`}
                src={displaySrc}
                alt={step.title}
                fit={imageFit}
                aspectRatio="4/3"
              />
              <div
                className="absolute bottom-4 left-4 text-white pointer-events-none select-none z-10"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(3rem, 12vw, 5rem)",
                  opacity: 0.12,
                  lineHeight: 1,
                }}
              >
                {step.num}
              </div>
            </div>

            <div>
              <p
                className="text-primary text-xs tracking-widest uppercase mb-4"
                style={{ letterSpacing: "0.2em" }}
              >
                {step.sub}
              </p>
              <h3
                className="text-foreground mb-8"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700 }}
              >
                {step.title}
              </h3>
              <ul className="space-y-4">
                {step.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-4">
                    <span className="text-primary shrink-0 mt-0.5">✦</span>
                    <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>STEP {step.num}</span>
                  <span>
                    {active + 1} / {steps.length}
                  </span>
                </div>
                <div className="h-px bg-border">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${((active + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setActive(Math.max(0, active - 1))}
                  disabled={active === 0}
                  className="px-6 py-2 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-30 transition-all"
                  style={{ borderRadius: "2px" }}
                >
                  ← 이전
                </button>
                <button
                  onClick={() => setActive(Math.min(steps.length - 1, active + 1))}
                  disabled={active === steps.length - 1}
                  className="px-6 py-2 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-30 transition-all"
                  style={{ borderRadius: "2px" }}
                >
                  다음 →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
