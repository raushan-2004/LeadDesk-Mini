import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'LeadDesk Admin Login',
  description: 'Authentication entry point for LeadDesk CRM administration panel.',
};

export default async function LoginPage() {
  const session = await auth();

  // If session already exists with the expected admin role, redirect server-side to /admin
  if (session && (session.user as { role?: string })?.role === 'ADMIN') {
    redirect('/admin');
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 py-12">
      <LoginForm />
    </main>
  );
}
