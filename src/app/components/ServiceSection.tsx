import { Film, Users, Calendar, Smartphone, Youtube } from "lucide-react";
import { useState } from "react";

const services = [
  {
    icon: Film,
    title: "브랜드 콘텐츠",
    desc: "브랜드의 가치와 메시지를 효과적으로 전달하는 영상 제작",
    detail: "기업 아이덴티티, 제품 소개, 브랜드 필름 등 브랜드가 전하고자 하는 스토리를 감각적인 영상으로 구현합니다.",
  },
  {
    icon: Calendar,
    title: "행사 스케치",
    desc: "기업 행사, 세미나, 컨퍼런스 등 현장의 생생한 순간을 기록하고 편집하여 의미 있는 콘텐츠로 재구성",
    detail: "현장의 열기와 감동을 놓치지 않고 담아내어 기업의 소중한 순간을 영상으로 남깁니다.",
  },
  {
    icon: Smartphone,
    title: "숏폼 콘텐츠",
    desc: "SNS 플랫폼에 최적화된 짧고 임팩트 있는 영상 콘텐츠 제작",
    detail: "인스타그램 릴스, 틱톡, 유튜브 쇼츠 등 각 플랫폼에 최적화된 숏폼 영상을 기획·제작합니다.",
  },
  {
    icon: Users,
    title: "인터뷰 영상",
    desc: "인물의 이야기를 진정성 있게 담아내는 인터뷰 영상 제작",
    detail: "CEO 인터뷰, 직원 스토리, 고객 후기 등 사람의 진심을 화면 앞에서 자연스럽게 이끌어냅니다.",
  },
  {
    icon: Youtube,
    title: "유튜브 콘텐츠",
    desc: "유튜브 채널 운영을 위한 기획형 콘텐츠 제작 및 편집",
    detail: "채널 전략 수립부터 기획, 촬영, 편집까지 유튜브 채널 성장을 위한 콘텐츠를 꾸준히 제작합니다.",
  },
];

export function ServiceSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="service" className="py-32 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <span
            className="text-primary"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", letterSpacing: "0.3em" }}
          >
            SERVICE
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="mb-20">
          <h2
            className="text-foreground leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
          >
            제공 서비스
          </h2>
          <p className="text-muted-foreground" style={{ fontSize: "1rem" }}>
            브랜드의 목적에 맞는 최적의 영상 솔루션을 제안합니다
          </p>
        </div>

        {/* Service grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {services.map((svc, i) => {
            const Icon = svc.icon;
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
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {svc.desc}
                </p>
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

          {/* CTA block */}
          <div
            className="bg-primary p-10 flex flex-col justify-between cursor-pointer group hover:bg-primary/90 transition-colors"
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            <div>
              <p className="text-primary-foreground/70 text-xs tracking-widest uppercase mb-4" style={{ letterSpacing: "0.2em" }}>
                Get Started
              </p>
              <h3 className="text-primary-foreground mb-3" style={{ fontSize: "1.3rem", fontWeight: 700, lineHeight: 1.3 }}>
                프로젝트를 시작할 준비가 되셨나요?
              </h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                지금 바로 무료 상담을 신청하세요
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-primary-foreground font-medium group-hover:gap-4 transition-all">
              <span>상담 신청하기</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
