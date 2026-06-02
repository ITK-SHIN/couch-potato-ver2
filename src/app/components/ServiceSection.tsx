import { useState } from "react";
import { useSiteContentDisplay } from "../../context/SiteContentDisplayContext";
import { getServiceIcon } from "../../lib/serviceIcons";

export function ServiceSection() {
  const content = useSiteContentDisplay();
  const { title, subtitle, items, cta } = content.services;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="service" className="py-32 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span className="section-label">SERVICE</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="mb-20">
          <h2 className="section-title text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground" style={{ fontSize: "1rem" }}>
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {items.map((svc, i) => {
            const Icon = getServiceIcon(svc.icon);
            return (
              <div
                key={i}
                className="bg-secondary p-10 relative overflow-hidden group cursor-default transition-all duration-300 hover:bg-card"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="absolute top-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full" />
                <Icon
                  size={28}
                  className="text-primary mb-6 transition-transform duration-300 group-hover:scale-110"
                />
                <h3 className="text-foreground mb-3" style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                  {svc.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{svc.desc}</p>
                <p
                  className="text-muted-foreground/70 text-xs leading-relaxed transition-all duration-300"
                  style={{
                    maxHeight: hovered === i ? "100px" : "0",
                    overflow: "hidden",
                    opacity: hovered === i ? 1 : 0,
                  }}
                >
                  {svc.detail}
                </p>
                <div className="mt-6 flex items-center gap-2 text-primary text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>자세히 보기</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}

          <div
            className="bg-primary p-10 flex flex-col justify-between cursor-pointer group hover:bg-primary/90 transition-colors"
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            <div>
              <p
                className="text-primary-foreground/70 text-xs tracking-widest uppercase mb-4"
                style={{ letterSpacing: "0.2em" }}
              >
                {cta.badge}
              </p>
              <h3
                className="text-primary-foreground mb-3"
                style={{ fontSize: "1.3rem", fontWeight: 700, lineHeight: 1.3 }}
              >
                {cta.title}
              </h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">{cta.desc}</p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-primary-foreground font-medium group-hover:gap-4 transition-all">
              <span>{cta.button}</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
