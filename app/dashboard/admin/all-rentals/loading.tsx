import { Loader2, ClipboardList } from "lucide-react"

export default function AdminAllRentalsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            <ClipboardList className="size-3.5" />
            <span>Platform Rental Ledger</span>
          </div>
          <div className="h-8 w-64 rounded-lg bg-muted" />
          <div className="h-4 w-96 max-w-full rounded bg-muted" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-muted" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border border-border/70 bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded bg-muted" />
              <div className="size-10 rounded-xl bg-muted" />
            </div>
            <div className="h-8 w-20 rounded bg-muted" />
            <div className="h-3 w-32 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="rounded-xl border border-border/70 bg-card p-4 flex flex-col md:flex-row gap-3">
        <div className="h-10 flex-1 rounded-lg bg-muted" />
        <div className="h-10 w-44 rounded-lg bg-muted" />
        <div className="h-10 w-44 rounded-lg bg-muted" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <div className="h-5 w-48 rounded bg-muted" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-rose-600" />
            <span>Loading rental records...</span>
          </div>
        </div>
        <div className="divide-y divide-border/50">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="p-4 grid grid-cols-7 gap-4 items-center">
              <div className="h-10 rounded bg-muted col-span-1" />
              <div className="h-10 rounded bg-muted col-span-1" />
              <div className="h-10 rounded bg-muted col-span-1" />
              <div className="h-10 rounded bg-muted col-span-1" />
              <div className="h-10 rounded bg-muted col-span-1" />
              <div className="h-6 rounded-full bg-muted col-span-1" />
              <div className="h-8 rounded bg-muted col-span-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
