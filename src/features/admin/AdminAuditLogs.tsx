import React, { useState, useEffect } from 'react';
import { AuditLog } from '../../types';
import { db } from '../../services/db';
import { Shield, Clock, FileText, Search } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(db.getAuditLogs());
  const [search, setSearch] = useState('');

  useEffect(() => {
    const refresh = () => setLogs(db.getAuditLogs());
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        l.action.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.userId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            System Audit Trail & Security Logs
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Immutable log of all operational events, refunds, price edits, and counter verification scans.
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-stone-100 text-stone-800 px-3 py-1.5 rounded-xl border border-stone-200">
          {logs.length} Logged Events
        </span>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by action, user ID, or event details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-3">Action</th>
                <th className="py-3.5 px-3">Actor / User</th>
                <th className="py-3.5 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-xs bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-200">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-stone-600">
                    {log.userId}
                  </td>

                  <td className="py-3 px-4 text-stone-800 font-medium leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
