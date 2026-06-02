import { ChevronDown } from "lucide-react";
import { BrandLogo } from "../../components/BrandLogo";
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
        <p className="section-label mb-5 md:mb-6">{hero.badge}</p>
        <h1 className="mb-7 md:mb-8 flex justify-center">
          <BrandLogo variant="hero" />
        </h1>
        <p className="text-foreground/80 mb-4 text-lg md:text-xl lg:text-2xl font-light leading-relaxed">
          {hero.subtitle}
        </p>
        <p className="text-muted-foreground mb-12 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
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
        className="absolute bottom-10 right-8 text-muted-foreground hidden md:block text-[0.7rem] tracking-[0.2em] font-medium"
        style={{ writingMode: "vertical-rl" }}
      >
        {hero.cornerLabel}
      </div>
    </section>
  );
}
