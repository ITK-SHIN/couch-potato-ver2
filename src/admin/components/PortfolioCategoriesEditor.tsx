import { useState } from "react";
import { X } from "lucide-react";
import { portfolioItemCategoryOptions } from "../../lib/portfolioCategories";
import type { PortfolioItem } from "../../types/siteContent";
import { AdminField, AdminInput } from "./AdminField";

function ensureCategoriesWithAll(categories: string[]): string[] {
  const rest = categories.filter((c) => c !== "전체");
  return ["전체", ...rest];
}

export function PortfolioCategoriesEditor({
  categories,
  items,
  onChange,
}: {
  categories: string[];
  items: PortfolioItem[];
  onChange: (categories: string[], items: PortfolioItem[]) => void;
}) {
  const [newName, setNewName] = useState("");
  const normalized = ensureCategoriesWithAll(categories);
  const assignable = normalized.filter((c) => c !== "전체");

  const apply = (nextCategories: string[], nextItems: PortfolioItem[]) => {
    onChange(ensureCategoriesWithAll(nextCategories), nextItems);
  };

  const handleAdd = () => {
    const name = newName.trim();
    if (!name || name === "전체") return;
    if (normalized.includes(name)) {
      setNewName("");
      return;
    }
    apply([...normalized, name], items);
    setNewName("");
  };

  const handleRemove = (name: string) => {
    const nextCategories = normalized.filter((c) => c !== name);
    const fallback = portfolioItemCategoryOptions(nextCategories)[0] ?? "유튜브";
    const nextItems = items.map((item) =>
      item.category === name ? { ...item, category: fallback } : item
    );
    apply(nextCategories, nextItems);
  };

  return (
    <AdminField
      label="카테고리"
      hint="「전체」는 항상 유지됩니다. × 로 삭제, 아래에서 새 카테고리를 추가하세요."
    >
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span
            className="inline-flex items-center px-3 py-1.5 text-xs bg-primary/15 text-primary border border-primary/30"
            style={{ borderRadius: "2px" }}
          >
            전체
          </span>
          {assignable.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1.5 text-xs border border-border text-foreground bg-muted"
              style={{ borderRadius: "2px" }}
            >
              {name}
              <button
                type="button"
                onClick={() => handleRemove(name)}
                className="p-0.5 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label={`${name} 카테고리 삭제`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <AdminInput
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="새 카테고리 이름"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="shrink-0 px-4 py-2 text-xs border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            style={{ borderRadius: "2px" }}
          >
            추가
          </button>
        </div>
      </div>
    </AdminField>
  );
}
