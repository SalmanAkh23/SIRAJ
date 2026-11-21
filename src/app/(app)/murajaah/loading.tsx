export default function MurajaahLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10 animate-pulse space-y-8">
      {/* Skeleton Hero */}
      <div className="h-64 rounded-3xl bg-surface border border-border flex flex-col justify-between p-8">
        <div className="space-y-3">
          <div className="w-36 h-5 rounded-full bg-border" />
          <div className="w-3/4 max-w-md h-9 rounded-xl bg-border" />
          <div className="w-full max-w-lg h-4 rounded-lg bg-border" />
        </div>
        <div className="w-48 h-12 rounded-xl bg-border" />
      </div>

      {/* Skeleton Setup */}
      <div className="h-96 rounded-3xl bg-surface border border-border p-8 space-y-6">
        <div className="w-48 h-6 rounded-lg bg-border" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-border/60" />
          ))}
        </div>
        <div className="h-24 rounded-2xl bg-border/40" />
      </div>
    </div>
  );
}

