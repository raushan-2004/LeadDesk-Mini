import React from 'react';
import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-45 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            LeadDesk
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
            Admin Dashboard
          </span>
        </div>
        <Link
          href="/"
          className="text-xs font-bold text-zinc-600 hover:text-zinc-950 dark:text-zinc-450 dark:hover:text-zinc-50 transition-colors focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none rounded px-1.5 py-1"
        >
          View Public Site &rarr;
        </Link>
      </div>
    </header>
  );
}
