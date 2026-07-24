import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Capabilities from '@/components/landing/Capabilities';
import Process from '@/components/landing/Process';
import LeadSection from '@/components/landing/LeadSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Capabilities />
        <Process />
        <LeadSection />
      </main>
      <Footer />
    </div>
  );
}
