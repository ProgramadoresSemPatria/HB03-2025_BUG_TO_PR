"use client";

export function StatsSkeleton({ labels }: { labels: string[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {labels.map((label, index) => (
        <div
          key={index}
          className="p-4 rounded border border-slate-900/80 bg-[#0a0a0a]/50 backdrop-blur-sm"
          style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)' }}
        >
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
            {label}
          </div>
          <div className="h-6 bg-slate-800 rounded w-12 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function HistorySkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-4 rounded border border-slate-900/80 bg-[#0a0a0a]/50 animate-pulse"
          style={{
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
          }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-800 shrink-0" />
              <div className="h-4 bg-slate-800 rounded w-32" />
              <div className="h-5 bg-slate-800 rounded w-16" />
            </div>
          </div>
          <div className="h-3 bg-slate-800 rounded w-full mb-2" />
          <div className="h-3 bg-slate-800 rounded w-3/4 mb-3" />
          <div className="flex items-center justify-between">
            <div className="h-5 bg-slate-800 rounded w-20" />
            <div className="h-4 bg-slate-800 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

