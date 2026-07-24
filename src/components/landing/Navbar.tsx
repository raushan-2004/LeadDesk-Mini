import React from 'react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none rounded"
        >
          LeadDesk
        </a>
        
        <nav className="hidden sm:flex items-center space-x-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a
            href="#capabilities"
            className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none rounded"
          >
            Capabilities
          </a>
          <a
            href="#process"
            className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none rounded"
          >
            Process
          </a>
        </nav>

        <a
          href="#contact"
          className="inline-flex items-center justify-center py-2 px-4 rounded-md text-xs font-bold text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-205 transition-colors focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none"
        >
          Start a Project
        </a>
      </div>
    </header>
  );
}
