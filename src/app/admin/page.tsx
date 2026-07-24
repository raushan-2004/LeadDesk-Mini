import React from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'LeadDesk Admin | Lead Capture Pipeline',
  description: 'Inquiry and conversion CRM pipeline for LeadDesk studio leads.',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
