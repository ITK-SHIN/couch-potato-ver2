import { Plus, Trash2 } from "lucide-react";
import { AdminInput } from "./AdminField";

export function StringListEditor({
  items,
  onChange,
  addLabel = "항목 추가",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <AdminInput
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="shrink-0 w-10 border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors flex items-center justify-center"
            style={{ borderRadius: "2px" }}
            aria-label="삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  );
}
