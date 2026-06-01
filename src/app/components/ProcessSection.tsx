import { useState } from "react";

const steps = [
  {
    num: "01",
    title: "상담",
    sub: "STEP 01 상담",
    image: "https://images.unsplash.com/photo-1575029644286-efb9039cac46?w=600&h=400&fit=crop&auto=format",
    items: ["제작 목적 파악", "클라이언트 니즈 확인", "예산 및 일정 확인", "최적의 솔루션 제안"],
  },
  {
    num: "02",
    title: "기획",
    sub: "STEP 02 기획",
    image: "https://images.unsplash.com/photo-1611784728558-6c7d9b409cdf?w=600&h=400&fit=crop&auto=format",
    items: ["콘텐츠 방향성 설정", "구성 및 스토리보드 설계", "촬영 계획 수립", "창의적인 아이디어 개발"],
  },
  {
    num: "03",
    title: "촬영",
    sub: "STEP 03 촬영",
    image: "https://images.unsplash.com/photo-1632187989763-c9c620420b4d?w=600&h=400&fit=crop&auto=format",
    items: ["전문 장비를 활용한 현장 촬영", "체계적인 촬영 진행", "진정성 있는 현장 포착", "고품질 영상 소스 확보"],
  },
  {
    num: "04",
    title: "편집",
    sub: "STEP 04 편집",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop&auto=format",
    items: ["촬영 소스 검토 및 선별", "영상 편집 및 컷 편집", "자막 및 그래픽 디자인 작업", "색보정 및 사운드 믹싱", "전문적인 완성도 구현", "브랜드 아이덴티티 반영"],
  },
  {
    num: "05",
    title: "수정",
    sub: "STEP 05 수정",
    image: "https://images.unsplash.com/photo-1490810194309-344b3661ba39?w=600&h=400&fit=crop&auto=format",
    items: ["클라이언트 피드백 수렴", "수정 사항 반영 및 보완", "세부 조정 및 보완", "품질 검수 진행", "완성도 극대화", "클라이언트의 만족도 확인"],
  },
  {
    num: "06",
    title: "납품",
    sub: "STEP 06 납품",
    image: "https://images.unsplash.com/photo-1528109966604-5a6a4a964e8d?w=600&h=400&fit=crop&auto=format",
    items: ["최종 포맷 변환", "파일 전달 및 백업", "다양한 플랫폼 대응", "애프터 서비스 안내", "프로젝트 결과 확인", "지속적인 파트너십 유지"],
  },
];

export function ProcessSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="process" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
            제작 프로세스
          </h2>
          <p className="text-muted-foreground">상담부터 납품까지 체계적인 6단계 프로세스</p>
        </div>

        {/* Step tabs */}
        <div className="flex gap-1 mb-12 flex-wrap">
          {steps.map((step, i) => (
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
              <span className="text-xs opacity-60 mr-1">{step.num}</span> {step.title}
            </button>
          ))}
        </div>

        {/* Active step content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src={steps[active].image}
              alt={steps[active].title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div
              className="absolute bottom-6 left-6 text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "5rem", opacity: 0.15, lineHeight: 1 }}
            >
              {steps[active].num}
            </div>
          </div>

          <div>
            <p className="text-primary text-xs tracking-widest uppercase mb-4" style={{ letterSpacing: "0.2em" }}>
              {steps[active].sub}
            </p>
            <h3
              className="text-foreground mb-8"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700 }}
            >
              {steps[active].title}
            </h3>
            <ul className="space-y-4">
              {steps[active].items.map((item, j) => (
                <li key={j} className="flex items-start gap-4">
                  <span className="text-primary shrink-0 mt-0.5">✦</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {/* Progress bar */}
            <div className="mt-10">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>STEP {steps[active].num}</span>
                <span>{active + 1} / {steps.length}</span>
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
      </div>
    </section>
  );
}
