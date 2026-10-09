interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <header className="mb-6 lg:mb-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted mt-1.5 text-sm sm:text-base">{subtitle}</p>}
        </div>
        {children}
      </div>
    </header>
  );
}
