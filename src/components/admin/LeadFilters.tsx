import React from 'react';
import { LEAD_STATUSES } from '@/constants/lead';

interface LeadFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  disabled: boolean;
}

export default function LeadFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  disabled,
}: LeadFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full items-stretch sm:items-center">
      {/* Search Input */}
      <div className="flex-grow">
        <label htmlFor="admin-search" className="sr-only">
          Search by name or email
        </label>
        <input
          id="admin-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
          placeholder="Search by name or email..."
          className="w-full px-3 py-2.5 border rounded-md shadow-sm transition-colors text-black dark:text-white bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none disabled:opacity-60 text-sm"
        />
      </div>

      {/* Status Filter */}
      <div className="flex-shrink-0 min-w-[160px]">
        <label htmlFor="admin-status-filter" className="sr-only">
          Filter by Status
        </label>
        <select
          id="admin-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2.5 border rounded-md shadow-sm transition-colors text-black dark:text-white bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none disabled:opacity-60 text-sm"
        >
          <option value="">All Statuses</option>
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      {(search || statusFilter) && (
        <button
          onClick={() => {
            setSearch('');
            setStatusFilter('');
          }}
          disabled={disabled}
          className="px-4 py-2.5 text-sm font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none rounded-md"
        >
          Clear
        </button>
      )}
    </div>
  );
}
