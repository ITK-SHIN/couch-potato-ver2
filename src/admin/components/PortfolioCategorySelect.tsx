import { portfolioItemCategoryOptions } from "../../lib/portfolioCategories";
import { AdminField } from "./AdminField";
import { adminInputClass } from "./AdminField";

export function PortfolioCategorySelect({
  label,
  categories,
  value,
  onChange,
  hint,
}: {
  label: string;
  categories: string[];
  value: string;
  onChange: (category: string) => void;
  hint?: string;
}) {
  const options = portfolioItemCategoryOptions(categories);
  const selected = options.includes(value) ? value : options[0];

  return (
    <AdminField label={label} hint={hint ?? "목록에서 선택하세요."}>
      <select
        className={adminInputClass}
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        style={{ borderRadius: "2px" }}
      >
        {options.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </AdminField>
  );
}
