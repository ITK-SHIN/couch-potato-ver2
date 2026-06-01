import { ChevronDown } from "lucide-react";
import { useSiteContentDisplay } from "../../context/SiteContentDisplayContext";

export function HeroSection() {
  const content = useSiteContentDisplay();
  const hero = content.hero;

  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <img
        src={hero.backgroundImage}
        alt=""
        fetchPriority="high"
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p
          className="text-primary text-sm tracking-widest uppercase mb-6"
          style={{ letterSpacing: "0.3em" }}
        >
          {hero.badge}
        </p>
        <h1
          className="text-foreground mb-6 leading-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            letterSpacing: "0.05em",
          }}
        >
          {hero.title}
        </h1>
        <p
          className="text-foreground/80 mb-4 leading-relaxed"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", fontWeight: 300 }}
        >
          {hero.subtitle}
        </p>
        <p
          className="text-muted-foreground mb-12"
          style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}
        >
          {hero.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() =>
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-primary text-primary-foreground px-8 py-4 text-sm tracking-wider hover:bg-primary/90 transition-colors"
            style={{ borderRadius: "2px" }}
          >
            {hero.primaryButton}
          </button>
          <button
            onClick={() =>
              document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" })
            }
            className="border border-foreground/30 text-foreground px-8 py-4 text-sm tracking-wider hover:border-foreground/60 transition-colors"
            style={{ borderRadius: "2px" }}
          >
            {hero.secondaryButton}
          </button>
        </div>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-foreground/40 hover:text-foreground/70 transition-colors animate-bounce"
      >
        <ChevronDown size={28} />
      </button>

      <div
        className="absolute bottom-10 right-8 text-muted-foreground hidden md:block"
        style={{ fontSize: "0.7rem", letterSpacing: "0.2em", writingMode: "vertical-rl" }}
      >
        {hero.cornerLabel}
      </div>
    </section>
  );
}
