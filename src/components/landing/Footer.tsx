import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-zinc-500 dark:text-zinc-400">
        <span>
          &copy; {currentYear} LeadDesk. All rights reserved.
        </span>
        
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-zinc-950 dark:text-zinc-50 underline decoration-zinc-400 hover:decoration-zinc-950 dark:decoration-zinc-650 dark:hover:decoration-zinc-50 transition-colors focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none rounded px-1"
        >
          Built for Digital Heroes Training Task
        </a>
      </div>
    </footer>
  );
}
