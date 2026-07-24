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
      // Fallback redirection in case signout throws
      window.location.href = '/login';
    }
  };

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

        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
            Logged in as <strong className="text-zinc-850 dark:text-zinc-250 font-bold">{user.name || user.email || 'Admin'}</strong>
          </span>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-red-650 hover:text-red-700 dark:text-red-400 dark:hover:text-red-305 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none rounded px-2.5 py-1 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40"
          >
            Sign Out
          </button>

          <Link
            href="/"
            className="text-xs font-bold text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none rounded px-1.5 py-1"
          >
            View Public Site &rarr;
          </Link>
        </div>
      </div>
    </header>
  );
}
