import React from 'react';
import { Cpu, Code, Layers, ShoppingBag } from 'lucide-react';

export default function Capabilities() {
  const items = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'High-performance web applications built with modern frameworks. Optimized for speed, reliability, and scale.',
    },
    {
      icon: Cpu,
      title: 'Product Engineering',
      description: 'End-to-end software development, robust systems architecture, and API integrations tailored to your business.',
    },
    {
      icon: Layers,
      title: 'UI/UX Design',
      description: 'Deliberate, accessible, and user-centric interfaces focused on workflow efficiency and conversion optimization.',
    },
    {
      icon: ShoppingBag,
      title: 'E-commerce Solutions',
      description: 'Custom shop development, checkout optimizations, and secure payment integrations built for smooth conversions.',
    },
  ];

  return (
    <section id="capabilities" className="py-20 sm:py-24 max-w-6xl mx-auto px-6 border-b border-zinc-200 dark:border-zinc-800 scroll-mt-16">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-start gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Our Capabilities
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
            Engineered for quality. Designed for impact.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex gap-5 p-6 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex-shrink-0 text-zinc-900 dark:text-zinc-50 mt-1">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-650 dark:text-zinc-450 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
