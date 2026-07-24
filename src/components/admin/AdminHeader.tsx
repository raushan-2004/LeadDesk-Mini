'use client';

import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  return (
    <header className="sticky top-0 z-45 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base sm:text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 shrink-0">
            LeadDesk
          </span>
          <span className="hidden xs:inline text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold whitespace-nowrap">
            Admin
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="hidden lg:inline text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]">
            {user.name || user.email || 'Admin'}
          </span>

          <Link
            href="/"
            className="hidden sm:inline text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none rounded px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Public Site →
          </Link>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none rounded px-2.5 py-1 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 whitespace-nowrap"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
