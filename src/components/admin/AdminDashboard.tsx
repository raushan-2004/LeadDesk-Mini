'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import AdminHeader from './AdminHeader';
import LeadStats from './LeadStats';
import LeadFilters from './LeadFilters';
import LeadsTable from './LeadsTable';
import LeadCard from './LeadCard';

interface Lead {
  _id: string;
  name: string;
  email: string;
  budget: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter State
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Update Pending States
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, boolean>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Debounce search query input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // 2. Fetch Leads handler (race-condition proof with AbortController, memoized to satisfy hooks)
  const fetchLeads = useCallback(async (searchVal: string, statusVal: string, isInitial: boolean) => {
    // Wait for the next tick to ensure we are not calling setState synchronously in the effect
    await Promise.resolve();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const queryParams = new URLSearchParams();
      if (searchVal) queryParams.append('search', searchVal);
      if (statusVal) queryParams.append('status', statusVal);

      const url = `/api/leads${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url, { signal: controller.signal });
      const result = await response.json();

      if (result.success) {
        setFilteredLeads(result.data);
        if (isInitial && !searchVal && !statusVal) {
          setAllLeads(result.data);
        }
        setError(null);
      } else {
        setError(result.error?.message || 'Failed to fetch leads from database.');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Failed to fetch leads from server. Please try again.');
      } else if (!(err instanceof Error)) {
        setError('Failed to fetch leads from server. Please try again.');
      }
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, []);

  // 3. React on filter & search changes (avoids duplicate GETs by reading local cache when empty)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      // First load fetches all leads to populate cache and UI
      timer = setTimeout(() => {
        fetchLeads('', '', true);
      }, 0);
    } else if (debouncedSearch || statusFilter) {
      // Fetch filtered results from the backend
      timer = setTimeout(() => {
        fetchLeads(debouncedSearch, statusFilter, false);
      }, 0);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [debouncedSearch, statusFilter, loading, fetchLeads]);

  // 4. Handle Lead status changes via PATCH /api/leads/[id]/status
  const handleStatusChange = async (id: string, newStatus: string) => {
    if (pendingUpdates[id]) return;
    setPendingUpdates((prev) => ({ ...prev, [id]: true }));
    setGeneralError(null);

    try {
      const response = await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        const updatedLead = result.data;
        
        // Update locally in cache and filtered states
        setAllLeads((prev) => prev.map((l) => (l._id === id ? updatedLead : l)));
        setFilteredLeads((prev) => prev.map((l) => (l._id === id ? updatedLead : l)));
      } else {
        setGeneralError('Something went wrong while updating status. Please try again.');
      }
    } catch (err) {
      console.error('Failed to patch status:', err);
      setGeneralError('Something went wrong while updating status. Please try again.');
    } finally {
      setPendingUpdates((prev) => ({ ...prev, [id]: false }));
    }
  };

  // 5. Derive visibleLeads from cache or filtered state (eliminates state synchronization effects)
  const visibleLeads = (!debouncedSearch && !statusFilter) ? allLeads : filteredLeads;

  // 5. Derive global statistics dynamically from allLeads cache (keeps stats globally correct)
  const totalLeads = allLeads.length;
  const newLeads = allLeads.filter((l) => l.status === 'NEW').length;
  const contactedLeads = allLeads.filter((l) => l.status === 'CONTACTED').length;
  const closedLeads = allLeads.filter((l) => l.status === 'CLOSED').length;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans">
      <AdminHeader />
      
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-10 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
            Leads
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your digital agency inquiries and conversion pipeline.
          </p>
        </div>

        {/* Global Summary Statistics */}
        <LeadStats
          total={totalLeads}
          newCount={newLeads}
          contactedCount={contactedLeads}
          closedCount={closedLeads}
          loading={loading && allLeads.length === 0}
        />

        {/* Filters and Search Query inputs */}
        <LeadFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          disabled={loading && allLeads.length === 0}
        />

        {/* General Update Error alerts */}
        {generalError && (
          <div
            role="alert"
            className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-zinc-900/50 dark:text-red-450 border border-red-200 dark:border-red-900"
          >
            <span className="font-semibold">Update Error:</span> {generalError}
          </div>
        )}

        {/* Lead Table (Desktop Viewport) and Cards List (Mobile Viewport) */}
        {loading ? (
          <div className="space-y-4">
            <div className="w-full h-10 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
            <div className="w-full h-32 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
            <div className="w-full h-32 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
          </div>
        ) : error ? (
          <div
            role="alert"
            className="p-8 text-center border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/10 rounded-lg"
          >
            <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-2">
              Failed to load Leads
            </h3>
            <p className="text-sm text-red-650 dark:text-red-450 mb-4">
              {error}
            </p>
            <button
              onClick={() => fetchLeads(debouncedSearch, statusFilter, true)}
              className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none rounded-md"
            >
              Retry
            </button>
          </div>
        ) : allLeads.length === 0 ? (
          <div className="text-center py-16 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-1">
              No leads yet
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              New lead submissions from your landing page form will appear here.
            </p>
          </div>
        ) : visibleLeads.length === 0 ? (
          <div className="text-center py-16 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-1">
              No results found
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No leads match your current search queries or filters. Try adjusting your search term.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table Viewport (md and above) */}
            <LeadsTable
              leads={visibleLeads}
              onStatusChange={handleStatusChange}
              pendingUpdates={pendingUpdates}
            />
            
            {/* Mobile Cards List Viewport (below md) */}
            <div className="block md:hidden space-y-4">
              {visibleLeads.map((lead) => (
                <LeadCard
                  key={lead._id}
                  lead={lead}
                  onStatusChange={handleStatusChange}
                  pendingUpdates={pendingUpdates}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
