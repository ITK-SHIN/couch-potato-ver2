import type { PortfolioItem, SiteContent } from "../types/siteContent";
import { generatedPortfolioItems } from "../../scripts/portfolio-items.generated";

export const defaultSiteContent: SiteContent = {
  hero: {
    badge: "Video Production Studio",
    title: "COUCHPOTATO",
    subtitle: "기획부터 촬영, 편집까지",
    description: "브랜드의 이야기를 영상으로 만드는 콘텐츠 제작 파트너",
    backgroundImage:
      "https://images.unsplash.com/photo-1632187981988-40f3cbaeef5e?w=1800&h=1200&fit=crop&auto=format",
    primaryButton: "상담 신청하기",
    secondaryButton: "포트폴리오 보기",
    cornerLabel: "SCROLL DOWN",
  },
  highlights: [
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
  ],
  about: {
    heading: "카우치포테이토 소개",
    intro:
      "브랜드 콘텐츠부터 숏폼까지 목적에 맞는 영상을 기획하고 제작하는 콘텐츠 제작 파트너로서의 정체성을 명확히 전달합니다.",
    philosophyTitle: "제작 철학",
    philosophy1: "브랜드의 이야기를 영상으로 만든다는 핵심 가치",
    philosophy2: "기획부터 촬영, 편집까지 전 과정을 책임지는 원스톱 제작 시스템",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&h=600&fit=crop&auto=format",
    strengthsTitle: "핵심 강점",
    strengths: [
      "기획·촬영·편집 원스톱 제작",
      "소규모 팀의 빠른 커뮤니케이션",
      "브랜드 맞춤형 콘텐츠 기획",
      "다양한 분야의 제작 경험",
      "깔끔하고 감각적인 영상 퀄리티",
    ],
    fieldsTitle: "제작 분야",
    fields: [
      "브랜드 콘텐츠",
      "인터뷰 영상",
      "행사 스케치",
      "숏폼 콘텐츠",
      "유튜브 콘텐츠",
      "라이브 스트리밍",
    ],
  },
  services: {
    title: "제공 서비스",
    subtitle: "브랜드의 목적에 맞는 최적의 영상 솔루션을 제안합니다",
    items: [
      {
        icon: "film",
        title: "브랜드 콘텐츠",
        desc: "브랜드의 가치와 메시지를 효과적으로 전달하는 영상 제작",
        detail:
          "기업 아이덴티티, 제품 소개, 브랜드 필름 등 브랜드가 전하고자 하는 스토리를 감각적인 영상으로 구현합니다.",
      },
      {
        icon: "calendar",
        title: "행사 스케치",
        desc: "기업 행사, 세미나, 컨퍼런스 등 현장의 생생한 순간을 기록하고 편집하여 의미 있는 콘텐츠로 재구성",
        detail:
          "현장의 열기와 감동을 놓치지 않고 담아내어 기업의 소중한 순간을 영상으로 남깁니다.",
      },
      {
        icon: "smartphone",
        title: "숏폼 콘텐츠",
        desc: "SNS 플랫폼에 최적화된 짧고 임팩트 있는 영상 콘텐츠 제작",
        detail:
          "인스타그램 릴스, 틱톡, 유튜브 쇼츠 등 각 플랫폼에 최적화된 숏폼 영상을 기획·제작합니다.",
      },
      {
        icon: "users",
        title: "인터뷰 영상",
        desc: "인물의 이야기를 진정성 있게 담아내는 인터뷰 영상 제작",
        detail:
          "CEO 인터뷰, 직원 스토리, 고객 후기 등 사람의 진심을 화면 앞에서 자연스럽게 이끌어냅니다.",
      },
      {
        icon: "youtube",
        title: "유튜브 콘텐츠",
        desc: "유튜브 채널 운영을 위한 기획형 콘텐츠 제작 및 편집",
        detail:
          "채널 전략 수립부터 기획, 촬영, 편집까지 유튜브 채널 성장을 위한 콘텐츠를 꾸준히 제작합니다.",
      },
    ],
    cta: {
      badge: "Get Started",
      title: "프로젝트를 시작할 준비가 되셨나요?",
      desc: "지금 바로 무료 상담을 신청하세요",
      button: "상담 신청하기",
    },
  },
  process: {
    title: "제작 프로세스",
    subtitle: "상담부터 납품까지 체계적인 6단계 프로세스",
    steps: [
      {
        num: "01",
        title: "상담",
        sub: "STEP 01 상담",
        image:
          "https://images.unsplash.com/photo-1575029644286-efb9039cac46?w=600&h=400&fit=crop&auto=format",
        items: [
          "제작 목적 파악",
          "클라이언트 니즈 확인",
          "예산 및 일정 확인",
          "최적의 솔루션 제안",
        ],
      },
      {
        num: "02",
        title: "기획",
        sub: "STEP 02 기획",
        image:
          "https://images.unsplash.com/photo-1611784728558-6c7d9b409cdf?w=600&h=400&fit=crop&auto=format",
        items: [
          "콘텐츠 방향성 설정",
          "구성 및 스토리보드 설계",
          "촬영 계획 수립",
          "창의적인 아이디어 개발",
        ],
      },
      {
        num: "03",
        title: "촬영",
        sub: "STEP 03 촬영",
        image:
          "https://images.unsplash.com/photo-1632187989763-c9c620420b4d?w=600&h=400&fit=crop&auto=format",
        items: [
          "전문 장비를 활용한 현장 촬영",
          "체계적인 촬영 진행",
          "진정성 있는 현장 포착",
          "고품질 영상 소스 확보",
        ],
      },
      {
        num: "04",
        title: "편집",
        sub: "STEP 04 편집",
        image:
          "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop&auto=format",
        items: [
          "촬영 소스 검토 및 선별",
          "영상 편집 및 컷 편집",
          "자막 및 그래픽 디자인 작업",
          "색보정 및 사운드 믹싱",
          "전문적인 완성도 구현",
          "브랜드 아이덴티티 반영",
        ],
      },
      {
        num: "05",
        title: "수정",
        sub: "STEP 05 수정",
        image:
          "https://images.unsplash.com/photo-1490810194309-344b3661ba39?w=600&h=400&fit=crop&auto=format",
        items: [
          "클라이언트 피드백 수렴",
          "수정 사항 반영 및 보완",
          "세부 조정 및 보완",
          "품질 검수 진행",
          "완성도 극대화",
          "클라이언트의 만족도 확인",
        ],
      },
      {
        num: "06",
        title: "납품",
        sub: "STEP 06 납품",
        image:
          "https://images.unsplash.com/photo-1528109966604-5a6a4a964e8d?w=600&h=400&fit=crop&auto=format",
        items: [
          "최종 포맷 변환",
          "파일 전달 및 백업",
          "다양한 플랫폼 대응",
          "애프터 서비스 안내",
          "프로젝트 결과 확인",
          "지속적인 파트너십 유지",
        ],
      },
    ],
  },
  portfolio: {
    title: "포트폴리오",
    subtitle: "Try to 신감독 (@TryToShinDirect.) YouTube 제작 사례",
    categories: ["전체", "유튜브"],
    items: generatedPortfolioItems.map((item) => ({
      ...item,
    })) as PortfolioItem[],
    bottomButton: "제작 문의하기 →",
  },
  contact: {
    title: "제작 문의",
    subtitle: "프로젝트 이야기를 들려주세요. 빠르게 연락드리겠습니다.",
    email: "bano94@naver.com",
    phone: "010-8480-4376",
    instagram: "@couchpotato.studio",
    kakao: "카우치포테이토",
    responseTitle: "빠른 답변",
    responseText: "문의 접수 후 영업일 기준 1일 이내에 답변드립니다.",
    formServices: [
      "브랜드 콘텐츠",
      "행사 스케치",
      "숏폼 콘텐츠",
      "인터뷰 영상",
      "유튜브 콘텐츠",
      "기타",
    ],
    successTitle: "문의가 접수되었습니다",
    successMessage: "빠른 시일 내에 연락드리겠습니다.\n감사합니다.",
  },
  footer: {
    tagline:
      "기획부터 촬영, 편집까지\n브랜드의 이야기를 영상으로 만드는 콘텐츠 제작 파트너",
    ctaButton: "제작 문의하기",
    email: "bano94@naver.com",
    phone: "010-8480-4376",
    instagramHandle: "@couchpotato.studio",
    copyright: "© 2025 CouchPotato. All rights reserved.",
    taglineBottom: "영상 기획 · 촬영 · 편집 전문 스튜디오",
  },
};
