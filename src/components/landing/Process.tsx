import React from 'react';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: "Tell us what you're building",
      description: 'Fill out our inquiry form with your project name, email, budget range, and message.',
    },
    {
      num: '02',
      title: 'We review your requirements',
      description: 'Our engineering team reviews your goals, tech stack preferences, and specifications.',
    },
    {
      num: '03',
      title: 'We plan the next step',
      description: 'We align on a product roadmap, establish scope, and plan immediate execution milestones.',
    },
  ];

  return (
    <section id="process" className="py-20 sm:py-24 max-w-6xl mx-auto px-6 border-b border-zinc-200 dark:border-zinc-800 scroll-mt-16">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-start gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            How We Partner
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
            Our Process
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-start gap-4">
              <span className="text-3xl font-extrabold text-zinc-350 dark:text-zinc-700 leading-none">
                {step.num}
              </span>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-650 dark:text-zinc-450 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
