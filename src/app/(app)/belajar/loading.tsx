export default function BelajarLoading() {
  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10"
      aria-hidden="true"
    >
      {/* Hero Skeleton */}
      <div className="rounded-3xl border border-[#D6B878]/30 bg-white/70 p-6 sm:p-8 lg:p-10 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="skeleton h-7 w-40 rounded-full" />
            <div className="skeleton h-10 w-64 rounded-xl" />
            <div className="skeleton h-4 w-full max-w-lg" />
            <div className="skeleton h-4 w-4/5 max-w-md" />
            <div className="skeleton h-12 w-full max-w-xl rounded-2xl mt-4" />
            <div className="skeleton h-12 w-full max-w-xl rounded-xl mt-4" />
          </div>
          <div className="lg:col-span-5">
            <div className="skeleton h-60 w-full rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Kategori Materi Skeleton */}
      <div className="mb-11">
        <div className="flex items-center justify-between mb-4">
          <div className="skeleton h-6 w-44" />
          <div className="skeleton h-4 w-24" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-[#E6E3D8] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="skeleton w-11 h-11 rounded-xl" />
                <div className="skeleton w-6 h-6 rounded-full" />
              </div>
              <div className="skeleton h-4 w-2/3" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-4/5" />
            </div>
          ))}
        </div>
      </div>

      {/* Materi Populer Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="skeleton h-6 w-44" />
          <div className="skeleton h-4 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-[#E6E3D8] p-3.5 sm:p-4 flex flex-col sm:flex-row gap-4"
            >
              <div className="skeleton w-full sm:w-40 lg:w-44 h-44 sm:h-36 rounded-xl shrink-0" />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="skeleton h-5 w-16 rounded-full" />
                    <div className="skeleton h-4 w-24" />
                  </div>
                  <div className="skeleton h-5 w-4/5 mb-2" />
                  <div className="skeleton h-3.5 w-full mb-1.5" />
                  <div className="skeleton h-3.5 w-3/4" />
                </div>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#F0EDE4]">
                  <div className="skeleton h-2 flex-1 rounded-full" />
                  <div className="skeleton h-8 w-8 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
