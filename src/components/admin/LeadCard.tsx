'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
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

const STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  CLOSED: 'Closed',
};

const STATUS_BADGE: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  CONTACTED: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  CLOSED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

const DOT_COLOR: Record<string, string> = {
  NEW: 'bg-blue-500',
  CONTACTED: 'bg-amber-500',
  CLOSED: 'bg-green-500',
};

const MENU_ITEM: Record<string, string> = {
  NEW: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-800 dark:text-blue-400',
  CONTACTED: 'hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-800 dark:text-amber-400',
  CLOSED: 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-800 dark:text-green-400',
};

function CardStatusMenu({
  leadId,
  leadName,
  currentStatus,
  onStatusChange,
  pending,
}: {
  leadId: string;
  leadName: string;
  currentStatus: string;
  onStatusChange: (id: string, status: string) => Promise<void>;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX });
    };
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update); };
  }, [open]);

  const menu = open && menuPos
    ? ReactDOM.createPortal(
        <div
          ref={menuRef}
          role="menu"
          style={{ position: 'absolute', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
          className="min-w-[150px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl py-1"
        >
          {LEAD_STATUSES.map((s) => (
            <button
              key={s}
              role="menuitem"
              disabled={s === currentStatus}
              onClick={async () => { setOpen(false); await onStatusChange(leadId, s); }}
              className={`w-full text-left px-3 py-2.5 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-default ${MENU_ITEM[s] ?? ''}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT_COLOR[s]}`} />
              {STATUS_LABELS[s]}
              {s === currentStatus && (
                <svg className="ml-auto w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>,
        document.body
      )
    : null;

  return (
    <div className="flex items-center gap-2">
      {/* Badge */}
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none ${STATUS_BADGE[currentStatus] ?? STATUS_BADGE.NEW}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLOR[currentStatus] ?? DOT_COLOR.NEW}`} />
        {STATUS_LABELS[currentStatus] ?? currentStatus}
      </span>

      {/* Spinner or ⋮ */}
      {pending ? (
        <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-zinc-950 dark:border-zinc-600 dark:border-t-zinc-50 rounded-full animate-spin flex-shrink-0" />
      ) : (
        <>
          <button
            ref={btnRef}
            aria-label={`Change status for ${leadName}`}
            aria-haspopup="true"
            aria-expanded={open}
            onClick={openMenu}
            className="flex flex-col items-center justify-center gap-[3px] w-7 h-7 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300"
          >
            <span className="w-[3px] h-[3px] bg-zinc-500 dark:bg-zinc-400 rounded-full" />
            <span className="w-[3px] h-[3px] bg-zinc-500 dark:bg-zinc-400 rounded-full" />
            <span className="w-[3px] h-[3px] bg-zinc-500 dark:bg-zinc-400 rounded-full" />
          </button>
          {menu}
        </>
      )}
    </div>
  );
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
    <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
          {lead.name}
        </h3>
        <span className="text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap pt-0.5">
          {new Date(lead.createdAt).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </span>
      </div>

      {/* Meta grid */}
      <div className="px-4 pb-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div className="col-span-2">
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">Email </span>
          <a
            href={`mailto:${lead.email}`}
            className="text-zinc-900 dark:text-zinc-100 underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus:outline-none"
          >
            {lead.email}
          </a>
        </div>
        <div>
          <span className="text-zinc-500 dark:text-zinc-400 font-medium block mb-0.5">Budget</span>
          <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
            {BUDGET_LABELS[lead.budget as BudgetRange] || lead.budget}
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="px-4 pb-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {displayText}
        {needsTruncation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-1.5 font-bold text-zinc-950 dark:text-zinc-50 underline focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300 rounded px-0.5"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Status</span>
        <CardStatusMenu
          leadId={lead._id}
          leadName={lead.name}
          currentStatus={lead.status}
          onStatusChange={onStatusChange}
          pending={pendingUpdates[lead._id] ?? false}
        />
      </div>
    </div>
  );
}
