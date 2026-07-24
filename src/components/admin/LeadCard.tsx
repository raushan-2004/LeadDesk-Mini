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

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  pendingUpdates: Record<string, boolean>;
}

export default function LeadCard({ lead, onStatusChange, pendingUpdates }: LeadCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsTruncation = lead.message.length > 100;
  const displayText = isExpanded
    ? lead.message
    : needsTruncation
    ? lead.message.slice(0, 100) + '...'
    : lead.message;

  return (
    <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-3.5">
      {/* Header: Name and Status Badge */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 truncate">
          {lead.name}
        </h3>
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
      </div>

      {/* Meta Info */}
      <div className="flex flex-col gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        <div>
          <span className="font-semibold text-zinc-700 dark:text-zinc-350">Email: </span>
          <a
            href={`mailto:${lead.email}`}
            className="text-zinc-950 dark:text-zinc-100 underline hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300 rounded focus:outline-none px-0.5"
          >
            {lead.email}
          </a>
        </div>
        <div>
          <span className="font-semibold text-zinc-700 dark:text-zinc-350">Budget: </span>
          <span className="text-zinc-900 dark:text-zinc-200">{BUDGET_LABELS[lead.budget as BudgetRange] || lead.budget}</span>
        </div>
        <div>
          <span className="font-semibold text-zinc-700 dark:text-zinc-350">Received: </span>
          <span className="text-zinc-900 dark:text-zinc-200">
            {new Date(lead.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Message preview */}
      <div className="text-xs">
        <p
          id={`msg-card-desc-${lead._id}`}
          className="whitespace-pre-wrap break-words leading-relaxed text-zinc-650 dark:text-zinc-400"
        >
          {displayText}
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded ? 'true' : 'false'}
              aria-controls={`msg-card-desc-${lead._id}`}
              className="ml-1.5 font-bold text-zinc-950 dark:text-zinc-50 underline focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300 rounded px-0.5"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>

      {/* Footer Controls: Change Status Selector */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex items-center justify-between">
        <label
          htmlFor={`status-select-card-${lead._id}`}
          className="text-xs font-semibold text-zinc-500 dark:text-zinc-400"
        >
          Change Status
        </label>
        <div className="flex items-center gap-2">
          <select
            id={`status-select-card-${lead._id}`}
            value={lead.status}
            disabled={pendingUpdates[lead._id]}
            onChange={(e) => onStatusChange(lead._id, e.target.value)}
            className="text-xs font-bold px-2 py-1 border rounded bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300 focus:outline-none disabled:opacity-50"
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
      </div>
    </div>
  );
}
