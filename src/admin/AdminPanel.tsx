import { useEffect, useMemo, useState } from "react";
import { ExternalLink, LogOut, Save } from "lucide-react";
import { AdminLivePreview } from "./AdminLivePreview";
import { Link, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useSiteContent } from "../context/SiteContentContext";
import { isSiteContentDirty } from "../lib/isSiteContentDirty";
import { serviceIconOptions } from "../lib/serviceIcons";
import type { SiteContent, SiteSectionKey } from "../types/siteContent";
import {
  appendPortfolioItems,
  patchAbout,
  patchContact,
  patchFooter,
  patchHero,
  patchPortfolio,
  patchProcess,
  patchSeo,
  patchServices,
  patchServicesCta,
} from "./patchDraft";
import { clearAutosavedDraft, useDraftAutosave } from "./useDraftAutosave";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  adminInputClass,
} from "./components/AdminField";
import { ImageField } from "./components/ImageField";
import { StringListEditor } from "./components/StringListEditor";
import { PortfolioCategoriesEditor } from "./components/PortfolioCategoriesEditor";
import { PortfolioItemAddDialog } from "./components/PortfolioItemAddDialog";
import { PortfolioItemsEditor } from "./components/PortfolioItemsEditor";
import { PortfolioYoutubeBulkImport } from "./components/PortfolioYoutubeBulkImport";
import { ContentRevisionsPanel } from "./components/ContentRevisionsPanel";

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
  const { content: published, save, saving } = useSiteContent();
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<SiteContent>(published);
  const [section, setSection] = useState<SiteSectionKey>("hero");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [portfolioAddOpen, setPortfolioAddOpen] = useState(false);

  const hasUnsavedChanges = useMemo(
    () => isSiteContentDirty(published, draft),
    [published, draft]
  );

  useDraftAutosave(draft, hasUnsavedChanges);

  useEffect(() => {
    setDraft(published);
  }, [published]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsavedChanges]);

  const setDraftRoot = (next: SiteContent | ((prev: SiteContent) => SiteContent)) => {
    setDraft((prev) => (typeof next === "function" ? next(prev) : next));
  };

  const handleSave = async () => {
    try {
      await save(draft);
      clearAutosavedDraft();
      toast.success("저장되었습니다. 공개 사이트에 반영되었습니다.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "저장 실패");
    }
  };

  const handleDiscard = () => {
    if (!hasUnsavedChanges) return;
    setDraft(published);
    toast.message("변경 사항을 되돌렸습니다.");
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
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <ContentRevisionsPanel onRestore={(content) => setDraftRoot(content)} />
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-600 dark:text-amber-400 mr-1">
              미저장 변경
            </span>
          )}
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!hasUnsavedChanges || saving}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
            style={{ borderRadius: "2px" }}
          >
            되돌리기
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 disabled:opacity-50"
            style={{ borderRadius: "2px" }}
          >
            <Save size={16} />
            {saving ? "저장 중..." : "저장·공개 반영"}
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
                    setDraftRoot((prev) => patchHero(prev, { badge: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="메인 타이틀">
                <AdminInput
                  value={draft.hero.title}
                  onChange={(e) =>
                    setDraftRoot((prev) => patchHero(prev, { title: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="부제목">
                <AdminInput
                  value={draft.hero.subtitle}
                  onChange={(e) =>
                    setDraftRoot((prev) => patchHero(prev, { subtitle: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="설명">
                <AdminTextarea
                  value={draft.hero.description}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchHero(prev, { description: e.target.value })
                    )
                  }
                />
              </AdminField>
              <ImageField
                label="배경 이미지"
                preset="hero"
                hint="히어로 배경은 항상 화면에 맞게 자르기(꽉 차게)로 업로드됩니다."
                value={draft.hero.backgroundImage}
                onChange={(next) =>
                  setDraftRoot((prev) =>
                    patchHero(prev, { backgroundImage: next.image })
                  )
                }
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <AdminField label="주요 버튼">
                  <AdminInput
                    value={draft.hero.primaryButton}
                    onChange={(e) =>
                      setDraftRoot((prev) =>
                        patchHero(prev, { primaryButton: e.target.value })
                      )
                    }
                  />
                </AdminField>
                <AdminField label="보조 버튼">
                  <AdminInput
                    value={draft.hero.secondaryButton}
                    onChange={(e) =>
                      setDraftRoot((prev) =>
                        patchHero(prev, { secondaryButton: e.target.value })
                      )
                    }
                  />
                </AdminField>
              </div>
              <div className="p-4 border border-border/80 bg-secondary/20 space-y-4 mt-6">
                <h3 className="text-sm font-semibold text-foreground">검색·SNS (SEO)</h3>
                <p className="text-xs text-muted-foreground">
                  비우면 히어로 문구로 자동 설정됩니다. 저장 후 공개 사이트·검색엔진에 반영됩니다.
                </p>
                <AdminField label="사이트 이름">
                  <AdminInput
                    value={draft.seo?.siteName ?? ""}
                    onChange={(e) =>
                      setDraftRoot((prev) =>
                        patchSeo(prev, { siteName: e.target.value })
                      )
                    }
                    placeholder="예: 코치포테이토"
                  />
                </AdminField>
                <AdminField label="페이지 제목 (title)">
                  <AdminInput
                    value={draft.seo?.title ?? ""}
                    onChange={(e) =>
                      setDraftRoot((prev) => patchSeo(prev, { title: e.target.value }))
                    }
                    placeholder="비우면 사이트명 | 부제목"
                  />
                </AdminField>
                <AdminField label="설명 (meta description)">
                  <AdminTextarea
                    value={draft.seo?.description ?? ""}
                    onChange={(e) =>
                      setDraftRoot((prev) =>
                        patchSeo(prev, { description: e.target.value })
                      )
                    }
                    placeholder="비우면 히어로 설명 사용"
                  />
                </AdminField>
                <AdminField label="OG 이미지 URL">
                  <AdminInput
                    value={draft.seo?.ogImage ?? ""}
                    onChange={(e) =>
                      setDraftRoot((prev) => patchSeo(prev, { ogImage: e.target.value }))
                    }
                    placeholder="비우면 히어로 배경 이미지"
                  />
                </AdminField>
                <AdminField label="키워드 (쉼표 구분)">
                  <AdminInput
                    value={draft.seo?.keywords ?? ""}
                    onChange={(e) =>
                      setDraftRoot((prev) => patchSeo(prev, { keywords: e.target.value }))
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
                      onChange={(e) =>
                        setDraftRoot((prev) => ({
                          ...prev,
                          highlights: prev.highlights.map((card, idx) =>
                            idx === i ? { ...card, num: e.target.value } : card
                          ),
                        }))
                      }
                    />
                  </AdminField>
                  <AdminField label="제목">
                    <AdminInput
                      value={h.title}
                      onChange={(e) =>
                        setDraftRoot((prev) => ({
                          ...prev,
                          highlights: prev.highlights.map((card, idx) =>
                            idx === i ? { ...card, title: e.target.value } : card
                          ),
                        }))
                      }
                    />
                  </AdminField>
                  <AdminField label="설명">
                    <AdminTextarea
                      value={h.desc}
                      onChange={(e) =>
                        setDraftRoot((prev) => ({
                          ...prev,
                          highlights: prev.highlights.map((card, idx) =>
                            idx === i ? { ...card, desc: e.target.value } : card
                          ),
                        }))
                      }
                    />
                  </AdminField>
                  <ImageField
                    label="이미지"
                    preset="highlight"
                    value={h.img}
                    onChange={(next) =>
                      setDraftRoot((prev) => ({
                        ...prev,
                        highlights: prev.highlights.map((card, idx) =>
                          idx === i ? { ...card, img: next.image } : card
                        ),
                      }))
                    }
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
                    setDraftRoot((prev) => patchAbout(prev, { heading: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="소개 문단">
                <AdminTextarea
                  value={draft.about.intro}
                  onChange={(e) =>
                    setDraftRoot((prev) => patchAbout(prev, { intro: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="철학 제목">
                <AdminInput
                  value={draft.about.philosophyTitle}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchAbout(prev, { philosophyTitle: e.target.value })
                    )
                  }
                />
              </AdminField>
              <AdminField label="철학 1">
                <AdminTextarea
                  value={draft.about.philosophy1}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchAbout(prev, { philosophy1: e.target.value })
                    )
                  }
                />
              </AdminField>
              <AdminField label="철학 2">
                <AdminTextarea
                  value={draft.about.philosophy2}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchAbout(prev, { philosophy2: e.target.value })
                    )
                  }
                />
              </AdminField>
              <ImageField
                label="소개 이미지"
                uploadFit={draft.about.imageFit ?? "contain"}
                imageOriginal={draft.about.imageOriginal}
                coverPreset="aboutCover"
                containPreset="aboutFull"
                uploadFitName="about-image-fit"
                value={draft.about.image}
                onChange={(next) =>
                  setDraftRoot((prev) => ({
                    ...prev,
                    about: {
                      ...prev.about,
                      image: next.image,
                      imageOriginal: next.imageOriginal,
                      imageFit: next.imageFit,
                    },
                  }))
                }
              />
              <AdminField label="핵심 강점">
                <StringListEditor
                  items={draft.about.strengths}
                  onChange={(strengths) =>
                    setDraftRoot((prev) => patchAbout(prev, { strengths }))
                  }
                />
              </AdminField>
              <AdminField label="제작 분야">
                <StringListEditor
                  items={draft.about.fields}
                  onChange={(fields) =>
                    setDraftRoot((prev) => patchAbout(prev, { fields }))
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
                    setDraftRoot((prev) =>
                      patchServices(prev, { title: e.target.value })
                    )
                  }
                />
              </AdminField>
              <AdminField label="섹션 설명">
                <AdminInput
                  value={draft.services.subtitle}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchServices(prev, { subtitle: e.target.value })
                    )
                  }
                />
              </AdminField>
              {draft.services.items.map((svc, i) => (
                <div key={i} className="p-4 border border-border space-y-3">
                  <p className="text-sm font-medium">서비스 {i + 1}</p>
                  <AdminField label="아이콘">
                    <select
                      value={svc.icon}
                      onChange={(e) =>
                        setDraftRoot((prev) => ({
                          ...prev,
                          services: {
                            ...prev.services,
                            items: prev.services.items.map((item, idx) =>
                              idx === i
                                ? {
                                    ...item,
                                    icon: e.target.value as typeof item.icon,
                                  }
                                : item
                            ),
                          },
                        }))
                      }
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
                      onChange={(e) =>
                        setDraftRoot((prev) => ({
                          ...prev,
                          services: {
                            ...prev.services,
                            items: prev.services.items.map((item, idx) =>
                              idx === i ? { ...item, title: e.target.value } : item
                            ),
                          },
                        }))
                      }
                    />
                  </AdminField>
                  <AdminField label="짧은 설명">
                    <AdminTextarea
                      value={svc.desc}
                      onChange={(e) =>
                        setDraftRoot((prev) => ({
                          ...prev,
                          services: {
                            ...prev.services,
                            items: prev.services.items.map((item, idx) =>
                              idx === i ? { ...item, desc: e.target.value } : item
                            ),
                          },
                        }))
                      }
                    />
                  </AdminField>
                  <AdminField label="상세 설명">
                    <AdminTextarea
                      value={svc.detail}
                      onChange={(e) =>
                        setDraftRoot((prev) => ({
                          ...prev,
                          services: {
                            ...prev.services,
                            items: prev.services.items.map((item, idx) =>
                              idx === i ? { ...item, detail: e.target.value } : item
                            ),
                          },
                        }))
                      }
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
                      setDraftRoot((prev) =>
                        patchServicesCta(prev, { badge: e.target.value })
                      )
                    }
                  />
                </AdminField>
                <AdminField label="제목">
                  <AdminInput
                    value={draft.services.cta.title}
                    onChange={(e) =>
                      setDraftRoot((prev) =>
                        patchServicesCta(prev, { title: e.target.value })
                      )
                    }
                  />
                </AdminField>
                <AdminField label="설명">
                  <AdminInput
                    value={draft.services.cta.desc}
                    onChange={(e) =>
                      setDraftRoot((prev) =>
                        patchServicesCta(prev, { desc: e.target.value })
                      )
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
                    setDraftRoot((prev) =>
                      patchProcess(prev, { title: e.target.value })
                    )
                  }
                />
              </AdminField>
              <AdminField label="부제">
                <AdminInput
                  value={draft.process.subtitle}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchProcess(prev, { subtitle: e.target.value })
                    )
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
                    uploadFit={step.imageFit ?? "cover"}
                    imageOriginal={step.imageOriginal}
                    coverPreset="process"
                    containPreset="processFull"
                    uploadFitName={`process-image-fit-${i}`}
                    value={step.image}
                    onChange={(next) =>
                      setDraftRoot((prev) => ({
                        ...prev,
                        process: {
                          ...prev.process,
                          steps: prev.process.steps.map((s, idx) =>
                            idx === i
                              ? {
                                  ...s,
                                  image: next.image,
                                  imageOriginal: next.imageOriginal,
                                  imageFit: next.imageFit,
                                }
                              : s
                          ),
                        },
                      }))
                    }
                  />
                  <AdminField label="체크리스트">
                    <StringListEditor
                      items={step.items}
                      onChange={(items) =>
                        setDraftRoot((prev) => ({
                          ...prev,
                          process: {
                            ...prev.process,
                            steps: prev.process.steps.map((s, idx) =>
                              idx === i ? { ...s, items } : s
                            ),
                          },
                        }))
                      }
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
                    setDraftRoot((prev) =>
                      patchPortfolio(prev, { title: e.target.value })
                    )
                  }
                />
              </AdminField>
              <PortfolioCategoriesEditor
                categories={draft.portfolio.categories}
                items={draft.portfolio.items}
                onChange={(categories, items) =>
                  setDraftRoot((prev) => patchPortfolio(prev, { categories, items }))
                }
              />
              <PortfolioYoutubeBulkImport
                categories={draft.portfolio.categories}
                items={draft.portfolio.items}
                onAddItems={(newItems) =>
                  setDraftRoot((prev) => appendPortfolioItems(prev, newItems))
                }
              />
              <button
                type="button"
                className="px-4 py-2 border border-primary text-primary text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                style={{ borderRadius: "2px" }}
                onClick={() => setPortfolioAddOpen(true)}
              >
                + 포트폴리오 추가
              </button>
              <PortfolioItemAddDialog
                open={portfolioAddOpen}
                onOpenChange={setPortfolioAddOpen}
                categories={draft.portfolio.categories}
                onConfirm={(item) =>
                  setDraftRoot((prev) =>
                    patchPortfolio(prev, {
                      items: [{ ...item, id: newId() }, ...prev.portfolio.items],
                    })
                  )
                }
              />
              <PortfolioItemsEditor
                items={draft.portfolio.items}
                categories={draft.portfolio.categories}
                onItemsChange={(items) =>
                  setDraftRoot((prev) => patchPortfolio(prev, { items }))
                }
              />
            </div>
          )}

          {section === "contact" && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold mb-4">문의·연락처</h2>
              <AdminField label="섹션 제목">
                <AdminInput
                  value={draft.contact.title}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchContact(prev, { title: e.target.value })
                    )
                  }
                />
              </AdminField>
              <AdminField label="이메일">
                <AdminInput
                  value={draft.contact.email}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchContact(prev, { email: e.target.value })
                    )
                  }
                />
              </AdminField>
              <AdminField label="전화">
                <AdminInput
                  value={draft.contact.phone}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchContact(prev, { phone: e.target.value })
                    )
                  }
                />
              </AdminField>
              <AdminField label="인스타그램">
                <AdminInput
                  value={draft.contact.instagram}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchContact(prev, { instagram: e.target.value })
                    )
                  }
                />
              </AdminField>
              <AdminField label="카카오톡">
                <AdminInput
                  value={draft.contact.kakao}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchContact(prev, { kakao: e.target.value })
                    )
                  }
                />
              </AdminField>
              <AdminField label="폼 서비스 옵션">
                <StringListEditor
                  items={draft.contact.formServices}
                  onChange={(formServices) =>
                    setDraftRoot((prev) => patchContact(prev, { formServices }))
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
                    setDraftRoot((prev) =>
                      patchFooter(prev, { tagline: e.target.value })
                    )
                  }
                  rows={3}
                />
              </AdminField>
              <AdminField label="이메일">
                <AdminInput
                  value={draft.footer.email}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchFooter(prev, { email: e.target.value })
                    )
                  }
                />
              </AdminField>
              <AdminField label="전화">
                <AdminInput
                  value={draft.footer.phone}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchFooter(prev, { phone: e.target.value })
                    )
                  }
                />
              </AdminField>
              <AdminField label="저작권">
                <AdminInput
                  value={draft.footer.copyright}
                  onChange={(e) =>
                    setDraftRoot((prev) =>
                      patchFooter(prev, { copyright: e.target.value })
                    )
                  }
                />
              </AdminField>
            </div>
          )}
        </main>

        <AdminLivePreview
          draft={draft}
          activeSection={section}
          mobileOpen={previewOpen}
          onToggleMobile={() => setPreviewOpen((o) => !o)}
        />
        </div>
      </div>
    </div>
  );
}
