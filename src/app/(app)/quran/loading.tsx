export default function QuranLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10" aria-hidden="true">
      <div className="mb-6">
        <div className="skeleton h-8 w-40" />
        <div className="skeleton h-4 w-72 mt-3" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="skeleton h-12 w-72 rounded-2xl" />
        <div className="skeleton h-4 w-64" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="skeleton h-11 flex-1" />
        <div className="skeleton h-11 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card !p-5 flex items-center gap-4">
            <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
