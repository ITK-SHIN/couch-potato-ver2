import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function AdminField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

export const adminInputClass =
  "w-full bg-muted border border-border text-foreground px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors";

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${adminInputClass} ${props.className ?? ""}`}
      style={{ borderRadius: "2px", ...props.style }}
    />
  );
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${adminInputClass} resize-y min-h-[80px] ${props.className ?? ""}`}
      style={{ borderRadius: "2px", ...props.style }}
    />
  );
}
