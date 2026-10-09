import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="card text-center py-12 px-6">
      <div className="w-12 h-12 rounded-xl bg-primary/[0.06] flex items-center justify-center mx-auto mb-4">
        <Icon size={22} className="text-primary" strokeWidth={1.8} />
      </div>
      <h3 className="font-semibold text-text">{title}</h3>
      {description && (
        <p className="text-sm text-muted mt-2 max-w-sm mx-auto leading-relaxed">{description}</p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
