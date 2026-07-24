import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'LeadDesk Admin | Lead Capture Pipeline',
  description: 'Inquiry and conversion CRM pipeline for LeadDesk studio leads.',
};

export default async function AdminPage() {
  const session = await auth();

  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    redirect('/login');
  }

  const user = {
    name: session.user?.name || null,
    email: session.user?.email || null,
  };

  return <AdminDashboard user={user} />;
}
