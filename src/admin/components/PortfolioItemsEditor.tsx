import { useCallback, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { toast } from "sonner";
import type { PortfolioItem, PortfolioVideoType } from "../../types/siteContent";
import { moveArrayItem } from "../../lib/reorderArray";
import { getYoutubeThumbnail, parseYoutubeId } from "../../lib/youtube";
import {
  AdminField,
  AdminInput,
  adminInputClass,
} from "./AdminField";
import { ImageField } from "./ImageField";
import { VideoField } from "./VideoField";
import { PortfolioCategorySelect } from "./PortfolioCategorySelect";

type EditorProps = {
  items: PortfolioItem[];
  categories: string[];
  onItemsChange: (items: PortfolioItem[]) => void;
};

function updateItemAt(
  items: PortfolioItem[],
  index: number,
  patch: Partial<PortfolioItem>
): PortfolioItem[] {
  const next = [...items];
  next[index] = { ...next[index], ...patch };
  return next;
}

type CardHeaderProps = {
  item: PortfolioItem;
  index: number;
  total: number;
  expanded: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  onToggleExpand: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
};

function PortfolioCardHeader({
  item,
  index,
  total,
  expanded,
  dragHandleProps,
  onToggleExpand,
  onMoveUp,
  onMoveDown,
  onDelete,
}: CardHeaderProps) {
  return (
    <div className="flex items-center gap-2 p-3 min-h-[56px]">
      <button
        type="button"
        {...dragHandleProps}
        className="shrink-0 p-1.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none rounded-sm hover:bg-muted"
        aria-label={`${item.title || `작품 ${index + 1}`} 순서 변경`}
        title="드래그하여 순서 변경"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <span
        className="shrink-0 w-7 h-7 flex items-center justify-center text-xs font-semibold bg-muted text-muted-foreground"
        style={{ borderRadius: "2px" }}
      >
        {index + 1}
      </span>
      <img
        src={item.image}
        alt=""
        className="shrink-0 w-12 h-8 object-cover bg-muted"
        style={{ borderRadius: "2px" }}
        draggable={false}
      />
      <button
        type="button"
        onClick={onToggleExpand}
        className="flex-1 min-w-0 text-left"
      >
        <p className="text-sm font-medium truncate">
          {item.title || `작품 ${index + 1}`}
        </p>
        <p className="text-xs text-muted-foreground truncate">{item.category}</p>
      </button>
      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          disabled={index === 0}
          onClick={onMoveUp}
          className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
          aria-label="위로"
          title="한 칸 위로"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={index >= total - 1}
          onClick={onMoveDown}
          className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
          aria-label="아래로"
          title="한 칸 아래로"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onToggleExpand}
          className="p-1.5 text-muted-foreground hover:text-foreground"
          aria-expanded={expanded}
          aria-label={expanded ? "접기" : "펼치기"}
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="px-2 py-1 text-xs text-destructive hover:underline"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

type SortableCardProps = {
  item: PortfolioItem;
  index: number;
  total: number;
  expanded: boolean;
  isDragActive: boolean;
  onToggleExpand: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDelete: () => void;
  children: React.ReactNode;
};

function SortablePortfolioCard({
  item,
  index,
  total,
  expanded,
  isDragActive,
  onToggleExpand,
  onMove,
  onDelete,
  children,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : undefined,
  };

  const showExpanded = expanded && !isDragActive;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-border bg-background ${
        isDragging ? "opacity-40 shadow-sm" : ""
      }`}
      data-sortable-id={item.id}
    >
      <PortfolioCardHeader
        item={item}
        index={index}
        total={total}
        expanded={showExpanded}
        dragHandleProps={{ ...attributes, ...listeners }}
        onToggleExpand={onToggleExpand}
        onMoveUp={() => onMove(index, index - 1)}
        onMoveDown={() => onMove(index, index + 1)}
        onDelete={onDelete}
      />
      {showExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function PortfolioItemsEditorInner({ items, categories, onItemsChange }: EditorProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedBeforeDrag, setExpandedBeforeDrag] = useState<Set<string> | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const moveItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      onItemsChange(moveArrayItem(items, fromIndex, toIndex));
    },
    [items, onItemsChange]
  );

  const toggleExpand = (id: string) => {
    if (activeId) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
    setExpandedBeforeDrag(expandedIds);
    setExpandedIds(new Set());
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (expandedBeforeDrag) {
      setExpandedIds(expandedBeforeDrag);
      setExpandedBeforeDrag(null);
    }

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    onItemsChange(arrayMove(items, oldIndex, newIndex));
  };

  const handleDragCancel = () => {
    setActiveId(null);
    if (expandedBeforeDrag) {
      setExpandedIds(expandedBeforeDrag);
      setExpandedBeforeDrag(null);
    }
  };

  const activeItem = activeId
    ? items.find((item) => item.id === activeId)
    : undefined;
  const activeIndex = activeItem
    ? items.findIndex((item) => item.id === activeId)
    : -1;

  const sortableIds = items.map((item) => item.id);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        <strong className="text-foreground">≡ 핸들</strong>을 길게 끌어 순서를 바꿉니다.
        놓을 때 반영됩니다. ↑↓로 한 칸씩 이동할 수도 있습니다.
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item, i) => (
              <SortablePortfolioCard
                key={item.id}
                item={item}
                index={i}
                total={items.length}
                expanded={expandedIds.has(item.id)}
                isDragActive={activeId !== null}
                onToggleExpand={() => toggleExpand(item.id)}
                onMove={moveItem}
                onDelete={() => {
                  onItemsChange(items.filter((_, j) => j !== i));
                  setExpandedIds((prev) => {
                    const next = new Set(prev);
                    next.delete(item.id);
                    return next;
                  });
                }}
              >
                <PortfolioCategorySelect
                  label="카테고리"
                  categories={categories}
                  value={item.category}
                  onChange={(category) =>
                    onItemsChange(updateItemAt(items, i, { category }))
                  }
                />
                <AdminField label="제목">
                  <AdminInput
                    value={item.title}
                    onChange={(e) =>
                      onItemsChange(updateItemAt(items, i, { title: e.target.value }))
                    }
                  />
                </AdminField>
                <AdminField label="클라이언트">
                  <AdminInput
                    value={item.client}
                    onChange={(e) =>
                      onItemsChange(updateItemAt(items, i, { client: e.target.value }))
                    }
                  />
                </AdminField>
                <AdminField label="재생 시간">
                  <AdminInput
                    value={item.duration}
                    onChange={(e) =>
                      onItemsChange(updateItemAt(items, i, { duration: e.target.value }))
                    }
                  />
                </AdminField>
                <AdminField label="영상 종류">
                  <select
                    value={item.videoType ?? "none"}
                    className={adminInputClass}
                    onChange={(e) => {
                      const videoType = e.target.value as PortfolioVideoType;
                      onItemsChange(
                        updateItemAt(items, i, {
                          videoType,
                          youtubeUrl:
                            videoType === "youtube" ? item.youtubeUrl ?? "" : "",
                          videoUrl:
                            videoType === "upload" ? item.videoUrl ?? "" : "",
                        })
                      );
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
                        onChange={(e) =>
                          onItemsChange(
                            updateItemAt(items, i, { youtubeUrl: e.target.value })
                          )
                        }
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
                        onItemsChange(
                          updateItemAt(items, i, { image: getYoutubeThumbnail(id) })
                        );
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
                    onChange={(url) =>
                      onItemsChange(updateItemAt(items, i, { videoUrl: url }))
                    }
                  />
                )}
                <ImageField
                  label="썸네일"
                  preset="portfolio"
                  value={item.image}
                  onChange={(url) =>
                    onItemsChange(updateItemAt(items, i, { image: url }))
                  }
                />
              </SortablePortfolioCard>
            ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 200, easing: "ease-out" }}>
          {activeItem && activeIndex >= 0 ? (
            <div
              className="border border-primary bg-background shadow-lg ring-2 ring-primary/20"
              style={{ borderRadius: "2px" }}
            >
              <PortfolioCardHeader
                item={activeItem}
                index={activeIndex}
                total={items.length}
                expanded={false}
                onToggleExpand={() => {}}
                onMoveUp={() => {}}
                onMoveDown={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border">
          등록된 작품이 없습니다. 아래에서 추가하거나 YouTube 일괄 추가를 사용하세요.
        </p>
      )}
    </div>
  );
}

export function PortfolioItemsEditor(props: EditorProps) {
  return <PortfolioItemsEditorInner {...props} />;
}
