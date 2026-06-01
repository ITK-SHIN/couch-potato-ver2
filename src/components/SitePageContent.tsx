import { Navbar } from "../app/components/Navbar";
import { HeroSection } from "../app/components/HeroSection";
import { AboutSection } from "../app/components/AboutSection";
import { ServiceSection } from "../app/components/ServiceSection";
import { ProcessSection } from "../app/components/ProcessSection";
import { PortfolioSection } from "../app/components/PortfolioSection";
import { ContactSection } from "../app/components/ContactSection";
import { Footer } from "../app/components/Footer";
import { useSiteContentDisplay } from "../context/SiteContentDisplayContext";

/** 공개 사이트·관리자 미리보기에서 공통으로 쓰는 페이지 본문 */
export function SitePageContent() {
  const content = useSiteContentDisplay();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <section
        id="highlights"
        className="py-20 px-6 bg-secondary border-y border-border"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {content.highlights.map((h) => (
            <div key={h.num} className="group">
              <div
                className="relative overflow-hidden mb-6 bg-muted"
                style={{ aspectRatio: "16/10" }}
              >
                <img
                  src={h.img}
                  alt={h.title}
                  className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div
                  className="absolute bottom-4 left-4 text-white/20"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "4rem",
                    lineHeight: 1,
                  }}
                >
                  {h.num}
                </div>
              </div>
              <h3
                className="text-foreground mb-2"
                style={{ fontSize: "1rem", fontWeight: 600 }}
              >
                {h.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      <AboutSection />
      <ServiceSection />
      <ProcessSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
