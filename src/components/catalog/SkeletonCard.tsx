function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-surface-3 ${className}`}
      style={{
        backgroundImage: "linear-gradient(90deg, var(--color-surface-2) 25%, var(--color-surface-3) 37%, var(--color-surface-2) 63%)",
        backgroundSize: "400px 100%",
      }}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <Shimmer className="h-20 w-full rounded-none" />
      <div className="flex flex-col gap-1.5 p-2.5">
        <Shimmer className="h-2.5 w-4/5" />
        <Shimmer className="h-2 w-2/5" />
        <Shimmer className="mt-1 h-6 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonCardGrid() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
