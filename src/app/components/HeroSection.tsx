import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1632187981988-40f3cbaeef5e?w=1800&h=1200&fit=crop&auto=format)",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p
          className="text-primary text-sm tracking-widest uppercase mb-6"
          style={{ letterSpacing: "0.3em" }}
        >
          Video Production Studio
        </p>
        <h1
          className="text-foreground mb-6 leading-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            letterSpacing: "0.05em",
          }}
        >
          COUCHPOTATO
        </h1>
        <p
          className="text-foreground/80 mb-4 leading-relaxed"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", fontWeight: 300 }}
        >
          기획부터 촬영, 편집까지
        </p>
        <p
          className="text-muted-foreground mb-12"
          style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}
        >
          브랜드의 이야기를 영상으로 만드는 콘텐츠 제작 파트너
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-primary text-primary-foreground px-8 py-4 text-sm tracking-wider hover:bg-primary/90 transition-colors"
            style={{ borderRadius: "2px" }}
          >
            상담 신청하기
          </button>
          <button
            onClick={() => document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" })}
            className="border border-foreground/30 text-foreground px-8 py-4 text-sm tracking-wider hover:border-foreground/60 transition-colors"
            style={{ borderRadius: "2px" }}
          >
            포트폴리오 보기
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-foreground/40 hover:text-foreground/70 transition-colors animate-bounce"
      >
        <ChevronDown size={28} />
      </button>

      {/* Corner label */}
      <div
        className="absolute bottom-10 right-8 text-muted-foreground hidden md:block"
        style={{ fontSize: "0.7rem", letterSpacing: "0.2em", writingMode: "vertical-rl" }}
      >
        SCROLL DOWN
      </div>
    </section>
  );
}
