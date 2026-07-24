import React from 'react';

interface LeadStatsProps {
  total: number;
  newCount: number;
  contactedCount: number;
  closedCount: number;
  loading: boolean;
}

export default function LeadStats({ total, newCount, contactedCount, closedCount, loading }: LeadStatsProps) {
  const stats = [
    { label: 'Total Leads', value: total, bg: 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800' },
    { label: 'New', value: newCount, bg: 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-250 dark:border-blue-900/50 text-blue-950 dark:text-blue-400' },
    { label: 'Contacted', value: contactedCount, bg: 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-250 dark:border-amber-900/50 text-amber-950 dark:text-amber-400' },
    { label: 'Closed', value: closedCount, bg: 'bg-green-50/50 dark:bg-green-950/10 border-green-250 dark:border-green-900/50 text-green-950 dark:text-green-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`flex flex-col gap-1 p-5 rounded-lg border ${stat.bg}`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {stat.label}
          </span>
          <span className="text-2xl sm:text-3xl font-black tracking-tight">
            {loading ? (
              <span className="inline-block w-8 h-8 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse mt-1" />
            ) : (
              stat.value
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
