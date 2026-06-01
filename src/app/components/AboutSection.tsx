const strengths = [
  "기획·촬영·편집 원스톱 제작",
  "소규모 팀의 빠른 커뮤니케이션",
  "브랜드 맞춤형 콘텐츠 기획",
  "다양한 분야의 제작 경험",
  "깔끔하고 감각적인 영상 퀄리티",
];

const fields = [
  "브랜드 콘텐츠",
  "인터뷰 영상",
  "행사 스케치",
  "숏폼 콘텐츠",
  "유튜브 콘텐츠",
  "라이브 스트리밍",
];

export function AboutSection() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-20">
          <span
            className="text-primary"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", letterSpacing: "0.3em" }}
          >
            ABOUT
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Top block */}
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div>
            <h2
              className="text-foreground mb-6 leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
            >
              카우치포테이토 소개
            </h2>
            <p className="text-muted-foreground leading-relaxed" style={{ fontSize: "1.05rem" }}>
              브랜드 콘텐츠부터 숏폼까지 목적에 맞는 영상을 기획하고
              제작하는 콘텐츠 제작 파트너로서의 정체성을 명확히 전달합니다.
            </p>
          </div>
          <div>
            <h3 className="text-foreground mb-4" style={{ fontSize: "1.2rem", fontWeight: 600 }}>
              제작 철학
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              브랜드의 이야기를 영상으로 만든다는 핵심 가치
            </p>
            <p className="text-muted-foreground leading-relaxed">
              기획부터 촬영, 편집까지 전 과정을 책임지는 원스톱 제작 시스템
            </p>
            <div className="mt-6 w-12 h-0.5 bg-primary" />
          </div>
        </div>

        {/* Photo + stats */}
        <div className="grid md:grid-cols-5 gap-8 mb-24">
          <div className="md:col-span-3 relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <img
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&h=600&fit=crop&auto=format"
              alt="편집 스튜디오"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="md:col-span-2 flex flex-col justify-between py-4">
            <div>
              <h3 className="text-foreground mb-6" style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                핵심 강점
              </h3>
              <ul className="space-y-3">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground" style={{ fontSize: "0.95rem" }}>
                    <span className="text-primary mt-0.5 shrink-0">—</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div>
          <h3 className="text-muted-foreground text-sm tracking-widest uppercase mb-8" style={{ letterSpacing: "0.2em" }}>
            제작 분야
          </h3>
          <div className="flex flex-wrap gap-3">
            {fields.map((f, i) => (
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
