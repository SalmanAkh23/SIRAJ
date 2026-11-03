export default function JuzDetailLoading() {
  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton h-4 w-48" />
        <div className="skeleton h-8 w-28 rounded-lg" />
      </div>

      <div className="card mb-6 text-center py-8">
        <div className="skeleton h-5 w-28 mx-auto" />
        <div className="skeleton h-10 w-52 mx-auto mt-5" />
        <div className="skeleton h-5 w-60 mx-auto mt-4" />
        <div className="skeleton h-4 w-56 mx-auto mt-3" />
      </div>

      <div className="flex justify-center mb-6">
        <div className="skeleton h-12 w-full rounded-2xl" />
      </div>

      <div className="card py-8 px-5 sm:px-8 space-y-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton h-6 w-full" />
            <div className="skeleton h-6 w-11/12" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

