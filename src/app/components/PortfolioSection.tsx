import { useState } from "react";
import { Play } from "lucide-react";
import { useSiteContent } from "../../context/SiteContentContext";

export function PortfolioSection() {
  const { content } = useSiteContent();
  const { title, subtitle, categories, items, bottomButton } = content.portfolio;
  const [activeCategory, setActiveCategory] = useState("전체");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered =
    activeCategory === "전체"
      ? items
      : items.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-32 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span
            className="text-primary"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", letterSpacing: "0.3em" }}
          >
            PORTFOLIO
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2
              className="text-foreground leading-tight mb-2"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
            >
              {title}
            </h2>
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-xs transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
                style={{ borderRadius: "2px" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden cursor-pointer group"
              style={{ aspectRatio: "4/3" }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-black/60 flex flex-col justify-between p-5 transition-opacity duration-300"
                style={{ opacity: hovered === item.id ? 1 : 0 }}
              >
                <div>
                  <span className="text-primary text-xs tracking-wider" style={{ letterSpacing: "0.1em" }}>
                    {item.category}
                  </span>
                </div>
                <div>
                  <h4 className="text-white mb-1" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                    {item.title}
                  </h4>
                  <p className="text-white/60 text-xs">{item.client}</p>
                </div>
              </div>
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-full">
                <Play size={10} className="text-white fill-white" />
                <span className="text-white text-xs">{item.duration}</span>
              </div>
              <div
                className="absolute top-3 left-3 bg-background/80 px-2 py-0.5 transition-opacity duration-300"
                style={{ opacity: hovered === item.id ? 0 : 1, borderRadius: "2px" }}
              >
                <span className="text-foreground/70 text-xs">{item.category}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="border border-border text-muted-foreground px-8 py-3 text-sm hover:border-primary hover:text-primary transition-all"
            style={{ borderRadius: "2px" }}
          >
            {bottomButton}
          </button>
        </div>
      </div>
    </section>
  );
}
