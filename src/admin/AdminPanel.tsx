import { useEffect, useState } from "react";
import { ExternalLink, LogOut, Save } from "lucide-react";
import { AdminLivePreview } from "./AdminLivePreview";
import { Link, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useSiteContent } from "../context/SiteContentContext";
import { defaultSiteContent } from "../data/defaultSiteContent";
import { serviceIconOptions } from "../lib/serviceIcons";
import type {
  PortfolioVideoType,
  SiteContent,
  SiteSectionKey,
} from "../types/siteContent";
import { emptyPortfolioItem } from "../lib/portfolioVideo";
import { getYoutubeThumbnail, parseYoutubeId } from "../lib/youtube";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  adminInputClass,
} from "./components/AdminField";
import { ImageField } from "./components/ImageField";
import { StringListEditor } from "./components/StringListEditor";
import { VideoField } from "./components/VideoField";
import { PortfolioYoutubeBulkImport } from "./components/PortfolioYoutubeBulkImport";

const SECTIONS: { key: SiteSectionKey; label: string }[] = [
  { key: "hero", label: "히어로" },
  { key: "highlights", label: "하이라이트" },
  { key: "about", label: "소개" },
  { key: "services", label: "서비스" },
  { key: "process", label: "제작 과정" },
  { key: "portfolio", label: "포트폴리오" },
  { key: "contact", label: "문의·연락처" },
  { key: "footer", label: "푸터" },
];

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AdminPanel() {
  const { content, updateContent, save, saving } = useSiteContent();
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [section, setSection] = useState<SiteSectionKey>("hero");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const setDraftRoot = (next: SiteContent) => {
    setDraft(next);
    updateContent(next);
  };

  const handleSave = async () => {
    try {
      await save(draft);
      toast.success("저장되었습니다. 사이트에 바로 반영됩니다.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "저장 실패");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <Toaster position="top-center" richColors />
      <header
        className="border-b border-border bg-card px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50"
        style={{ ["--admin-header-h" as string]: "57px" }}
      >
        <div className="flex items-center gap-4">
          <span
            className="text-foreground"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.06em" }}
          >
            관리자
          </span>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
          >
            <ExternalLink size={14} />
            사이트 보기
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 disabled:opacity-50"
            style={{ borderRadius: "2px" }}
          >
            <Save size={16} />
            {saving ? "저장 중..." : "저장하기"}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            style={{ borderRadius: "2px" }}
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        <aside className="lg:w-48 shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-secondary/30 p-3 flex lg:flex-col gap-1 overflow-x-auto">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSection(s.key)}
              className={`shrink-0 px-4 py-2.5 text-sm text-left transition-colors ${
                section === s.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              style={{ borderRadius: "2px" }}
            >
              {s.label}
            </button>
          ))}
        </aside>

        {/* 편집 · 미리보기 각 50% (사이드바 제외) */}
        <div className="flex-1 min-h-0 min-w-0 grid grid-cols-1 lg:grid-cols-2">
        <main className="min-h-0 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border p-6">
          {section === "hero" && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold mb-4">히어로 섹션</h2>
              <AdminField label="상단 라벨">
                <AdminInput
                  value={draft.hero.badge}
                  onChange={(e) =>
                    setDraftRoot({ ...draft, hero: { ...draft.hero, badge: e.target.value } })
                  }
                />
              </AdminField>
              <AdminField label="메인 타이틀">
                <AdminInput
                  value={draft.hero.title}
                  onChange={(e) =>
                    setDraftRoot({ ...draft, hero: { ...draft.hero, title: e.target.value } })
                  }
                />
              </AdminField>
              <AdminField label="부제목">
                <AdminInput
                  value={draft.hero.subtitle}
                  onChange={(e) =>
                    setDraftRoot({ ...draft, hero: { ...draft.hero, subtitle: e.target.value } })
                  }
                />
              </AdminField>
              <AdminField label="설명">
                <AdminTextarea
                  value={draft.hero.description}
                  onChange={(e) =>
                    setDraftRoot({ ...draft, hero: { ...draft.hero, description: e.target.value } })
                  }
                />
              </AdminField>
              <ImageField
                label="배경 이미지"
                value={draft.hero.backgroundImage}
                onChange={(url) =>
                  setDraftRoot({ ...draft, hero: { ...draft.hero, backgroundImage: url } })
                }
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <AdminField label="주요 버튼">
                  <AdminInput
                    value={draft.hero.primaryButton}
                    onChange={(e) =>
                      setDraftRoot({ ...draft, hero: { ...draft.hero, primaryButton: e.target.value } })
                    }
                  />
                </AdminField>
                <AdminField label="보조 버튼">
                  <AdminInput
                    value={draft.hero.secondaryButton}
                    onChange={(e) =>
                      setDraftRoot({
                        ...draft,
                        hero: { ...draft.hero, secondaryButton: e.target.value },
                      })
                    }
                  />
                </AdminField>
              </div>
            </div>
          )}

          {section === "highlights" && (
            <div className="space-y-8">
              <h2 className="text-lg font-semibold">하이라이트 카드</h2>
              {draft.highlights.map((h, i) => (
                <div key={i} className="p-4 border border-border space-y-4">
                  <p className="text-sm font-medium text-primary">카드 {h.num}</p>
                  <AdminField label="번호">
                    <AdminInput
                      value={h.num}
                      onChange={(e) => {
                        const highlights = [...draft.highlights];
                        highlights[i] = { ...h, num: e.target.value };
                        setDraftRoot({ ...draft, highlights });
                      }}
                    />
                  </AdminField>
                  <AdminField label="제목">
                    <AdminInput
                      value={h.title}
                      onChange={(e) => {
                        const highlights = [...draft.highlights];
                        highlights[i] = { ...h, title: e.target.value };
                        setDraftRoot({ ...draft, highlights });
                      }}
                    />
                  </AdminField>
                  <AdminField label="설명">
                    <AdminTextarea
                      value={h.desc}
                      onChange={(e) => {
                        const highlights = [...draft.highlights];
                        highlights[i] = { ...h, desc: e.target.value };
                        setDraftRoot({ ...draft, highlights });
                      }}
                    />
                  </AdminField>
                  <ImageField
                    label="이미지"
                    value={h.img}
                    onChange={(url) => {
                      const highlights = [...draft.highlights];
                      highlights[i] = { ...h, img: url };
                      setDraftRoot({ ...draft, highlights });
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {section === "about" && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold mb-4">소개 섹션</h2>
              <AdminField label="제목">
                <AdminInput
                  value={draft.about.heading}
                  onChange={(e) =>
                    setDraftRoot({ ...draft, about: { ...draft.about, heading: e.target.value } })
                  }
                />
              </AdminField>
              <AdminField label="소개 문단">
                <AdminTextarea
                  value={draft.about.intro}
                  onChange={(e) =>
                    setDraftRoot({ ...draft, about: { ...draft.about, intro: e.target.value } })
                  }
                />
              </AdminField>
              <AdminField label="철학 제목">
                <AdminInput
                  value={draft.about.philosophyTitle}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      about: { ...draft.about, philosophyTitle: e.target.value },
                    })
                  }
                />
              </AdminField>
              <AdminField label="철학 1">
                <AdminTextarea
                  value={draft.about.philosophy1}
                  onChange={(e) =>
                    setDraftRoot({ ...draft, about: { ...draft.about, philosophy1: e.target.value } })
                  }
                />
              </AdminField>
              <AdminField label="철학 2">
                <AdminTextarea
                  value={draft.about.philosophy2}
                  onChange={(e) =>
                    setDraftRoot({ ...draft, about: { ...draft.about, philosophy2: e.target.value } })
                  }
                />
              </AdminField>
              <ImageField
                label="소개 이미지"
                value={draft.about.image}
                onChange={(url) =>
                  setDraftRoot({ ...draft, about: { ...draft.about, image: url } })
                }
              />
              <AdminField label="핵심 강점">
                <StringListEditor
                  items={draft.about.strengths}
                  onChange={(strengths) =>
                    setDraftRoot({ ...draft, about: { ...draft.about, strengths } })
                  }
                />
              </AdminField>
              <AdminField label="제작 분야">
                <StringListEditor
                  items={draft.about.fields}
                  onChange={(fields) =>
                    setDraftRoot({ ...draft, about: { ...draft.about, fields } })
                  }
                />
              </AdminField>
            </div>
          )}

          {section === "services" && (
            <div className="space-y-8">
              <h2 className="text-lg font-semibold">서비스 섹션</h2>
              <AdminField label="섹션 제목">
                <AdminInput
                  value={draft.services.title}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      services: { ...draft.services, title: e.target.value },
                    })
                  }
                />
              </AdminField>
              <AdminField label="섹션 설명">
                <AdminInput
                  value={draft.services.subtitle}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      services: { ...draft.services, subtitle: e.target.value },
                    })
                  }
                />
              </AdminField>
              {draft.services.items.map((svc, i) => (
                <div key={i} className="p-4 border border-border space-y-3">
                  <p className="text-sm font-medium">서비스 {i + 1}</p>
                  <AdminField label="아이콘">
                    <select
                      value={svc.icon}
                      onChange={(e) => {
                        const items = [...draft.services.items];
                        items[i] = {
                          ...svc,
                          icon: e.target.value as typeof svc.icon,
                        };
                        setDraftRoot({ ...draft, services: { ...draft.services, items } });
                      }}
                      className={adminInputClass}
                      style={{ borderRadius: "2px" }}
                    >
                      {serviceIconOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </AdminField>
                  <AdminField label="제목">
                    <AdminInput
                      value={svc.title}
                      onChange={(e) => {
                        const items = [...draft.services.items];
                        items[i] = { ...svc, title: e.target.value };
                        setDraftRoot({ ...draft, services: { ...draft.services, items } });
                      }}
                    />
                  </AdminField>
                  <AdminField label="짧은 설명">
                    <AdminTextarea
                      value={svc.desc}
                      onChange={(e) => {
                        const items = [...draft.services.items];
                        items[i] = { ...svc, desc: e.target.value };
                        setDraftRoot({ ...draft, services: { ...draft.services, items } });
                      }}
                    />
                  </AdminField>
                  <AdminField label="상세 설명">
                    <AdminTextarea
                      value={svc.detail}
                      onChange={(e) => {
                        const items = [...draft.services.items];
                        items[i] = { ...svc, detail: e.target.value };
                        setDraftRoot({ ...draft, services: { ...draft.services, items } });
                      }}
                    />
                  </AdminField>
                </div>
              ))}
              <div className="p-4 border border-primary/30 space-y-3">
                <p className="text-sm font-medium text-primary">CTA 블록</p>
                <AdminField label="배지">
                  <AdminInput
                    value={draft.services.cta.badge}
                    onChange={(e) =>
                      setDraftRoot({
                        ...draft,
                        services: {
                          ...draft.services,
                          cta: { ...draft.services.cta, badge: e.target.value },
                        },
                      })
                    }
                  />
                </AdminField>
                <AdminField label="제목">
                  <AdminInput
                    value={draft.services.cta.title}
                    onChange={(e) =>
                      setDraftRoot({
                        ...draft,
                        services: {
                          ...draft.services,
                          cta: { ...draft.services.cta, title: e.target.value },
                        },
                      })
                    }
                  />
                </AdminField>
                <AdminField label="설명">
                  <AdminInput
                    value={draft.services.cta.desc}
                    onChange={(e) =>
                      setDraftRoot({
                        ...draft,
                        services: {
                          ...draft.services,
                          cta: { ...draft.services.cta, desc: e.target.value },
                        },
                      })
                    }
                  />
                </AdminField>
              </div>
            </div>
          )}

          {section === "process" && (
            <div className="space-y-8">
              <h2 className="text-lg font-semibold">제작 과정</h2>
              <AdminField label="제목">
                <AdminInput
                  value={draft.process.title}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      process: { ...draft.process, title: e.target.value },
                    })
                  }
                />
              </AdminField>
              <AdminField label="부제">
                <AdminInput
                  value={draft.process.subtitle}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      process: { ...draft.process, subtitle: e.target.value },
                    })
                  }
                />
              </AdminField>
              {draft.process.steps.map((step, i) => (
                <div key={i} className="p-4 border border-border space-y-3">
                  <p className="text-sm font-medium">
                    단계 {step.num} — {step.title}
                  </p>
                  <ImageField
                    label="이미지"
                    value={step.image}
                    onChange={(url) => {
                      const steps = [...draft.process.steps];
                      steps[i] = { ...step, image: url };
                      setDraftRoot({ ...draft, process: { ...draft.process, steps } });
                    }}
                  />
                  <AdminField label="체크리스트">
                    <StringListEditor
                      items={step.items}
                      onChange={(items) => {
                        const steps = [...draft.process.steps];
                        steps[i] = { ...step, items };
                        setDraftRoot({ ...draft, process: { ...draft.process, steps } });
                      }}
                    />
                  </AdminField>
                </div>
              ))}
            </div>
          )}

          {section === "portfolio" && (
            <div className="space-y-8">
              <h2 className="text-lg font-semibold">포트폴리오</h2>
              <AdminField label="제목">
                <AdminInput
                  value={draft.portfolio.title}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      portfolio: { ...draft.portfolio, title: e.target.value },
                    })
                  }
                />
              </AdminField>
              <AdminField label="카테고리 (쉼표 구분, 첫 항목은 '전체')">
                <AdminInput
                  value={draft.portfolio.categories.join(", ")}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      portfolio: {
                        ...draft.portfolio,
                        categories: e.target.value.split(",").map((s) => s.trim()),
                      },
                    })
                  }
                />
              </AdminField>
              <PortfolioYoutubeBulkImport
                items={draft.portfolio.items}
                onAddItems={(newItems) =>
                  setDraftRoot({
                    ...draft,
                    portfolio: {
                      ...draft.portfolio,
                      items: [...draft.portfolio.items, ...newItems],
                    },
                  })
                }
              />
              {draft.portfolio.items.map((item, i) => (
                <div key={item.id} className="p-4 border border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{item.title || `작품 ${i + 1}`}</p>
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline"
                      onClick={() => {
                        const items = draft.portfolio.items.filter((_, j) => j !== i);
                        setDraftRoot({
                          ...draft,
                          portfolio: { ...draft.portfolio, items },
                        });
                      }}
                    >
                      삭제
                    </button>
                  </div>
                  <AdminField label="카테고리">
                    <AdminInput
                      value={item.category}
                      onChange={(e) => {
                        const items = [...draft.portfolio.items];
                        items[i] = { ...item, category: e.target.value };
                        setDraftRoot({ ...draft, portfolio: { ...draft.portfolio, items } });
                      }}
                    />
                  </AdminField>
                  <AdminField label="제목">
                    <AdminInput
                      value={item.title}
                      onChange={(e) => {
                        const items = [...draft.portfolio.items];
                        items[i] = { ...item, title: e.target.value };
                        setDraftRoot({ ...draft, portfolio: { ...draft.portfolio, items } });
                      }}
                    />
                  </AdminField>
                  <AdminField label="클라이언트">
                    <AdminInput
                      value={item.client}
                      onChange={(e) => {
                        const items = [...draft.portfolio.items];
                        items[i] = { ...item, client: e.target.value };
                        setDraftRoot({ ...draft, portfolio: { ...draft.portfolio, items } });
                      }}
                    />
                  </AdminField>
                  <AdminField label="재생 시간">
                    <AdminInput
                      value={item.duration}
                      onChange={(e) => {
                        const items = [...draft.portfolio.items];
                        items[i] = { ...item, duration: e.target.value };
                        setDraftRoot({ ...draft, portfolio: { ...draft.portfolio, items } });
                      }}
                    />
                  </AdminField>
                  <AdminField label="영상 종류">
                    <select
                      value={item.videoType ?? "none"}
                      className={adminInputClass}
                      onChange={(e) => {
                        const videoType = e.target.value as PortfolioVideoType;
                        const items = [...draft.portfolio.items];
                        items[i] = {
                          ...item,
                          videoType,
                          youtubeUrl:
                            videoType === "youtube" ? item.youtubeUrl ?? "" : "",
                          videoUrl:
                            videoType === "upload" ? item.videoUrl ?? "" : "",
                        };
                        setDraftRoot({
                          ...draft,
                          portfolio: { ...draft.portfolio, items },
                        });
                      }}
                    >
                      <option value="none">없음 (썸네일만)</option>
                      <option value="youtube">YouTube (권장)</option>
                      <option value="upload">영상 업로드 (Supabase)</option>
                    </select>
                  </AdminField>
                  {item.videoType === "youtube" && (
                    <>
                      <AdminField
                        label="YouTube URL"
                        hint="watch, youtu.be, shorts 링크 또는 11자리 영상 ID"
                      >
                        <AdminInput
                          value={item.youtubeUrl ?? ""}
                          placeholder="https://www.youtube.com/watch?v=..."
                          onChange={(e) => {
                            const items = [...draft.portfolio.items];
                            items[i] = { ...item, youtubeUrl: e.target.value };
                            setDraftRoot({
                              ...draft,
                              portfolio: { ...draft.portfolio, items },
                            });
                          }}
                        />
                      </AdminField>
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline"
                        onClick={() => {
                          const id = parseYoutubeId(item.youtubeUrl ?? "");
                          if (!id) {
                            toast.error("올바른 YouTube URL을 입력해 주세요.");
                            return;
                          }
                          const items = [...draft.portfolio.items];
                          items[i] = {
                            ...item,
                            image: getYoutubeThumbnail(id),
                          };
                          setDraftRoot({
                            ...draft,
                            portfolio: { ...draft.portfolio, items },
                          });
                          toast.success("YouTube 썸네일을 적용했습니다.");
                        }}
                      >
                        YouTube 썸네일 적용
                      </button>
                    </>
                  )}
                  {item.videoType === "upload" && (
                    <VideoField
                      label="영상 파일 (MP4/WebM)"
                      value={item.videoUrl ?? ""}
                      onChange={(url) => {
                        const items = [...draft.portfolio.items];
                        items[i] = { ...item, videoUrl: url };
                        setDraftRoot({
                          ...draft,
                          portfolio: { ...draft.portfolio, items },
                        });
                      }}
                    />
                  )}
                  <ImageField
                    label="썸네일"
                    value={item.image}
                    onChange={(url) => {
                      const items = [...draft.portfolio.items];
                      items[i] = { ...item, image: url };
                      setDraftRoot({ ...draft, portfolio: { ...draft.portfolio, items } });
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() =>
                  setDraftRoot({
                    ...draft,
                    portfolio: {
                      ...draft.portfolio,
                      items: [
                        ...draft.portfolio.items,
                        emptyPortfolioItem({
                          id: newId(),
                          image: defaultSiteContent.portfolio.items[0].image,
                        }),
                      ],
                    },
                  })
                }
              >
                + 포트폴리오 추가
              </button>
            </div>
          )}

          {section === "contact" && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold mb-4">문의·연락처</h2>
              <AdminField label="섹션 제목">
                <AdminInput
                  value={draft.contact.title}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      contact: { ...draft.contact, title: e.target.value },
                    })
                  }
                />
              </AdminField>
              <AdminField label="이메일">
                <AdminInput
                  value={draft.contact.email}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      contact: { ...draft.contact, email: e.target.value },
                    })
                  }
                />
              </AdminField>
              <AdminField label="전화">
                <AdminInput
                  value={draft.contact.phone}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      contact: { ...draft.contact, phone: e.target.value },
                    })
                  }
                />
              </AdminField>
              <AdminField label="인스타그램">
                <AdminInput
                  value={draft.contact.instagram}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      contact: { ...draft.contact, instagram: e.target.value },
                    })
                  }
                />
              </AdminField>
              <AdminField label="카카오톡">
                <AdminInput
                  value={draft.contact.kakao}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      contact: { ...draft.contact, kakao: e.target.value },
                    })
                  }
                />
              </AdminField>
              <AdminField label="폼 서비스 옵션">
                <StringListEditor
                  items={draft.contact.formServices}
                  onChange={(formServices) =>
                    setDraftRoot({ ...draft, contact: { ...draft.contact, formServices } })
                  }
                />
              </AdminField>
            </div>
          )}

          {section === "footer" && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold mb-4">푸터</h2>
              <AdminField label="소개 (줄바꿈 가능)">
                <AdminTextarea
                  value={draft.footer.tagline.replace(/\\n/g, "\n")}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      footer: { ...draft.footer, tagline: e.target.value },
                    })
                  }
                  rows={3}
                />
              </AdminField>
              <AdminField label="이메일">
                <AdminInput
                  value={draft.footer.email}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      footer: { ...draft.footer, email: e.target.value },
                    })
                  }
                />
              </AdminField>
              <AdminField label="전화">
                <AdminInput
                  value={draft.footer.phone}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      footer: { ...draft.footer, phone: e.target.value },
                    })
                  }
                />
              </AdminField>
              <AdminField label="저작권">
                <AdminInput
                  value={draft.footer.copyright}
                  onChange={(e) =>
                    setDraftRoot({
                      ...draft,
                      footer: { ...draft.footer, copyright: e.target.value },
                    })
                  }
                />
              </AdminField>
            </div>
          )}
        </main>

        <AdminLivePreview
          activeSection={section}
          mobileOpen={previewOpen}
          onToggleMobile={() => setPreviewOpen((o) => !o)}
        />
        </div>
      </div>
    </div>
  );
}
