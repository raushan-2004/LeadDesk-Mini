import React from 'react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-950/20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-start text-left gap-6">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Digital Product & Engineering Studio
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 max-w-3xl leading-tight">
          We design and build software that performs.
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          LeadDesk is a modern product engineering team. We partner with ambitious companies to turn complex requirements into clean, fast, and scalable digital products.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a
            href="#contact"
            className="inline-flex items-center justify-center py-3 px-6 rounded-md text-sm font-bold text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none"
          >
            Start a Project
          </a>
          <a
            href="#capabilities"
            className="inline-flex items-center justify-center py-3 px-6 rounded-md text-sm font-bold text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none"
          >
            Capabilities
          </a>
        </div>
      </div>
    </section>
  );
}
