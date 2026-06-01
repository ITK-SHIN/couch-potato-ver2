import { useState } from "react";
import { Play } from "lucide-react";

const categories = ["전체", "브랜드 콘텐츠", "인터뷰 영상", "행사 영상", "숏폼 콘텐츠", "유튜브"];

const portfolios = [
  {
    id: 1,
    category: "브랜드 콘텐츠",
    title: "스타트업 브랜드 필름",
    client: "TechCo Korea",
    image: "https://images.unsplash.com/photo-1577190651915-bf62d54d5b36?w=600&h=400&fit=crop&auto=format",
    duration: "3:24",
  },
  {
    id: 2,
    category: "인터뷰 영상",
    title: "CEO 인터뷰 시리즈",
    client: "글로벌 컨설팅",
    image: "https://images.unsplash.com/photo-1631387019069-2ff599943f9a?w=600&h=400&fit=crop&auto=format",
    duration: "8:12",
  },
  {
    id: 3,
    category: "행사 영상",
    title: "연간 컨퍼런스 스케치",
    client: "미래산업협회",
    image: "https://images.unsplash.com/photo-1522327646852-4e28586a40dd?w=600&h=400&fit=crop&auto=format",
    duration: "5:40",
  },
  {
    id: 4,
    category: "숏폼 콘텐츠",
    title: "제품 런칭 릴스",
    client: "뷰티 브랜드 A",
    image: "https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?w=600&h=400&fit=crop&auto=format",
    duration: "0:45",
  },
  {
    id: 5,
    category: "유튜브",
    title: "채널 정기 콘텐츠",
    client: "라이프스타일 채널",
    image: "https://images.unsplash.com/photo-1612544409025-e1f6a56c1152?w=600&h=400&fit=crop&auto=format",
    duration: "12:08",
  },
  {
    id: 6,
    category: "브랜드 콘텐츠",
    title: "기업 홍보 영상",
    client: "금융그룹 B",
    image: "https://images.unsplash.com/photo-1490810194309-344b3661ba39?w=600&h=400&fit=crop&auto=format",
    duration: "2:30",
  },
  {
    id: 7,
    category: "인터뷰 영상",
    title: "직원 스토리텔링",
    client: "IT기업 C",
    image: "https://images.unsplash.com/photo-1688039763740-9036cb5d566e?w=600&h=400&fit=crop&auto=format",
    duration: "4:15",
  },
  {
    id: 8,
    category: "행사 영상",
    title: "제품 발표회 현장",
    client: "하드웨어 스타트업",
    image: "https://images.unsplash.com/photo-1575029644286-efb9039cac46?w=600&h=400&fit=crop&auto=format",
    duration: "6:22",
  },
];

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered =
    activeCategory === "전체"
      ? portfolios
      : portfolios.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-32 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              포트폴리오
            </h2>
            <p className="text-muted-foreground text-sm">브랜드·인터뷰·행사·유튜브 등 다양한 제작 사례</p>
          </div>
          {/* Category filter */}
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

        {/* Grid */}
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
              {/* Overlay */}
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
              {/* Play + duration always visible */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-full">
                <Play size={10} className="text-white fill-white" />
                <span className="text-white text-xs">{item.duration}</span>
              </div>
              {/* Category badge */}
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
            제작 문의하기 →
          </button>
        </div>
      </div>
    </section>
  );
}
