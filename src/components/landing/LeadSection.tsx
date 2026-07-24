import React from 'react';
import LeadForm from '../forms/LeadForm';

export default function LeadSection() {
  return (
    <section id="contact" className="py-20 sm:py-24 max-w-6xl mx-auto px-6 border-b border-zinc-200 dark:border-zinc-800 scroll-mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col items-start gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Get In Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
              Let&apos;s build something useful.
            </h2>
          </div>
          <p className="text-zinc-650 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">
            Tell us about the digital product you want to build. Share your requirements and budget range, and our technical engineering team will review it.
          </p>
          <div className="flex flex-col gap-4 mt-2">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
              What happens next?
            </h3>
            <ul className="text-xs text-zinc-600 dark:text-zinc-405 space-y-2 list-disc list-inside">
              <li>Our engineers evaluate your technical requirements.</li>
              <li>We request a brief discovery call to clarify details.</li>
              <li>We outline a product roadmap, scope, and timeline.</li>
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-7 flex justify-start lg:justify-end">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
