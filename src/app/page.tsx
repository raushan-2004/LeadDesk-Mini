export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-between p-8 bg-zinc-50 font-sans dark:bg-black text-black dark:text-zinc-50">
      <header className="w-full max-w-4xl py-6 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xl font-bold tracking-tight">LeadDesk Mini</span>
      </header>
      
      <main className="flex flex-col items-center justify-center flex-1 text-center py-20">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Stage 1 Complete</h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
          The foundation of the LeadDesk Mini application has been set up successfully.
          Database connections, constants, validation schemas, and models are configured.
        </p>
      </main>

      <footer className="w-full max-w-4xl py-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
        <span>
          Built for{' '}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-850 dark:hover:text-zinc-200"
          >
            Digital Heroes Training Task
          </a>
        </span>
      </footer>
    </div>
  );
}
