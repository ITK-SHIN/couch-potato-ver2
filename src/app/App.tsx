import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { ServiceSection } from "./components/ServiceSection";
import { ProcessSection } from "./components/ProcessSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";

const highlights = [
  {
    num: "01",
    title: "핵심 카피",
    desc: "기획부터 촬영·편집까지, 브랜드의 이야기를 영상으로 담습니다.",
    img: "https://images.unsplash.com/photo-1577190651915-bf62d54d5b36?w=500&h=340&fit=crop&auto=format",
  },
  {
    num: "02",
    title: "브랜드 포지셔닝",
    desc: "브랜드 콘텐츠부터 숏폼까지 목적에 맞는 영상을 제작하는 콘텐츠 제작 파트너. 신뢰할 수 있는 파트너십 구축.",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&h=340&fit=crop&auto=format",
  },
  {
    num: "03",
    title: "제작 범위",
    desc: "브랜드 콘텐츠 · 인터뷰 영상 · 행사 스케치 · 숏폼 콘텐츠 · 유튜브 콘텐츠",
    img: "https://images.unsplash.com/photo-1632187989763-c9c620420b4d?w=500&h=340&fit=crop&auto=format",
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />

      {/* Highlights bar */}
      <section className="py-20 px-6 bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {highlights.map((h) => (
            <div key={h.num} className="group">
              <div
                className="relative overflow-hidden mb-6"
                style={{ aspectRatio: "16/10" }}
              >
                <img
                  src={h.img}
                  alt={h.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div
                  className="absolute bottom-4 left-4 text-white/20"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4rem", lineHeight: 1 }}
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
              <p className="text-muted-foreground text-sm leading-relaxed">{h.desc}</p>
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
