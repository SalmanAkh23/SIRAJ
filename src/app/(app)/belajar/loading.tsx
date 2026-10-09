export default function BelajarLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10" aria-hidden="true">
      <div className="mb-6">
        <div className="skeleton h-8 w-52" />
        <div className="skeleton h-4 w-64 mt-3" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton w-10 h-10 mb-3" />
            <div className="skeleton h-4 w-2/3 mb-2" />
            <div className="skeleton h-3 w-full" />
          </div>
        ))}
      </div>

      <div className="skeleton h-6 w-40 mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-2 mb-3">
              <div className="skeleton h-5 w-16 rounded-full" />
              <div className="skeleton h-4 w-24" />
            </div>
            <div className="skeleton h-5 w-3/4 mb-2" />
            <div className="skeleton h-4 w-full mb-4" />
            <div className="skeleton h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
