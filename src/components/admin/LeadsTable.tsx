import React, { useState } from 'react';
import { BUDGET_LABELS, LEAD_STATUSES, BudgetRange } from '@/constants/lead';

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

interface LeadsTableProps {
  leads: Lead[];
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  pendingUpdates: Record<string, boolean>;
}

export default function LeadsTable({ leads, onStatusChange, pendingUpdates }: LeadsTableProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleMessage = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="hidden md:block w-full overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 shadow-sm">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left border-collapse">
        <thead className="bg-zinc-50 dark:bg-zinc-900/50">
          <tr>
            <th scope="col" className="px-6 py-3.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Budget
            </th>
            <th scope="col" className="px-6 py-3.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Message
            </th>
            <th scope="col" className="px-6 py-3.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Received
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-855">
          {leads.map((lead) => {
            const isExpanded = expandedIds[lead._id] || false;
            const needsTruncation = lead.message.length > 70;
            const displayText = isExpanded
              ? lead.message
              : needsTruncation
              ? lead.message.slice(0, 70) + '...'
              : lead.message;

            return (
              <tr key={lead._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                {/* Name */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {lead.name}
                </td>
                
                {/* Email */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-zinc-600 dark:text-zinc-400 hover:underline focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300 rounded focus:outline-none"
                  >
                    {lead.email}
                  </a>
                </td>
                
                {/* Budget */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                  {BUDGET_LABELS[lead.budget as BudgetRange] || lead.budget}
                </td>
                
                {/* Message */}
                <td className="px-6 py-4 text-sm max-w-[280px]">
                  <p
                    id={`msg-desc-${lead._id}`}
                    className="whitespace-pre-wrap break-words leading-relaxed text-zinc-600 dark:text-zinc-400"
                  >
                    {displayText}
                    {needsTruncation && (
                      <button
                        onClick={() => toggleMessage(lead._id)}
                        aria-expanded={isExpanded ? 'true' : 'false'}
                        aria-controls={`msg-desc-${lead._id}`}
                        className="ml-1.5 text-xs font-bold text-zinc-950 dark:text-zinc-50 underline focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300 rounded px-0.5 inline-block"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </p>
                </td>
                
                {/* Status Update Control */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none ${
                        lead.status === 'NEW'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : lead.status === 'CONTACTED'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      {lead.status === 'NEW' ? 'New' : lead.status === 'CONTACTED' ? 'Contacted' : 'Closed'}
                    </span>
                    
                    <select
                      aria-label={`Change status for ${lead.name}`}
                      value={lead.status}
                      disabled={pendingUpdates[lead._id]}
                      onChange={(e) => onStatusChange(lead._id, e.target.value)}
                      className="text-xs font-bold px-1.5 py-0.5 border rounded bg-zinc-50 dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none disabled:opacity-50"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    
                    {pendingUpdates[lead._id] && (
                      <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-zinc-950 dark:border-zinc-600 dark:border-t-zinc-50 rounded-full animate-spin" />
                    )}
                  </div>
                </td>
                
                {/* Received Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                  {new Date(lead.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
