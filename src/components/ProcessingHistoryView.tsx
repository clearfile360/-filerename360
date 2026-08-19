import React, { useState } from "react";
import {
  History,
  FileSpreadsheet,
  Terminal,
  Trash2,
  CheckCircle2,
  XCircle,
  Check,
  Search
} from "lucide-react";
import { HistoryEntry } from "../types";

interface ProcessingHistoryViewProps {
  history: HistoryEntry[];
  onClearHistory: () => void;
}

export const ProcessingHistoryView: React.FC<ProcessingHistoryViewProps> = ({
  history,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copiedScript, setCopiedScript] = useState(false);

  const filtered = history.filter((entry) => {
    const matchesSearch =
      entry.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.renamedFilename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.documentType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && entry.status === "Approved") ||
      (statusFilter === "rejected" && entry.status === "Rejected") ||
      (statusFilter === "manual" && entry.status === "Manual Edit");

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = [
      "Timestamp",
      "Original Filename",
      "Renamed Filename",
      "Document Type",
      "Confidence (%)",
      "Status",
    ];
    const rows = history.map((h) => [
      new Date(h.timestamp).toISOString(),
      `"${h.originalFilename.replace(/"/g, '""')}"`,
      `"${h.renamedFilename.replace(/"/g, '""')}"`,
      `"${h.documentType}"`,
      h.confidence,
      `"${h.status}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FileMind_History_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyBatchBashScript = () => {
    const approvedEntries = history.filter((h) => h.status !== "Rejected");
    if (approvedEntries.length === 0) return;

    let script = `#!/usr/bin/env bash\n# FileMind AI Local Renaming Script\n\n`;
    approvedEntries.forEach((h) => {
      script += `mv -n "${h.originalFilename}" "${h.renamedFilename}"\n`;
    });

    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f0f0f] border border-[#2a2a2a] p-5 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Processing History &amp; Audit Log
            </h2>
            <p className="text-xs text-[#888] mt-0.5">
              Review, export, and generate audit trails for all past AI document renaming operations.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={exportCSV}
            disabled={history.length === 0}
            className="px-3 py-1.5 text-xs font-medium rounded bg-[#1c1c1c] hover:bg-[#262626] text-[#e5e5e5] border border-[#333] transition-colors flex items-center space-x-1.5 disabled:opacity-40"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={copyBatchBashScript}
            disabled={history.length === 0}
            className="px-3 py-1.5 text-xs font-medium rounded bg-[#1c1c1c] hover:bg-[#262626] text-[#e5e5e5] border border-[#333] transition-colors flex items-center space-x-1.5 disabled:opacity-40"
          >
            {copiedScript ? (
              <>
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-400">Script Copied!</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5 text-[#888]" />
                <span>Copy Shell Script</span>
              </>
            )}
          </button>

          {history.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="p-1.5 text-[#888] hover:text-red-400 hover:bg-[#222] rounded transition-colors border border-[#2a2a2a]"
              title="Clear all history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0f0f0f] border border-[#2a2a2a] p-3 rounded-lg">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by filename or document type..."
            className="w-full text-xs bg-[#161616] border border-[#333] rounded pl-8 pr-3 py-1.5 text-[#e5e5e5] focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-[#161616] border border-[#333] rounded px-3 py-1.5 text-[#e5e5e5] focus:outline-none"
          >
            <option value="all">All Statuses ({history.length})</option>
            <option value="approved">Approved</option>
            <option value="manual">Manual Edit</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <History className="w-8 h-8 text-[#555] mx-auto" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              No processing history recorded
            </h3>
            <p className="text-xs text-[#888] max-w-sm mx-auto">
              Approved file rename operations will appear here for audit logging and batch exports.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d0d0d] border-b border-[#2a2a2a] text-[#555] font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Date / Time</th>
                  <th className="py-2.5 px-4">Original Filename</th>
                  <th className="py-2.5 px-4">Document Type</th>
                  <th className="py-2.5 px-4">Renamed Result</th>
                  <th className="py-2.5 px-4">Confidence</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-[#141414] transition-colors"
                  >
                    <td className="py-2.5 px-4 text-[#888] whitespace-nowrap font-mono text-[11px]">
                      {new Date(entry.timestamp).toLocaleDateString()}{" "}
                      <span className="text-[10px] text-[#666]">
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[#aaa]">
                      {entry.originalFilename}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#161616] text-[#ccc] border border-[#2a2a2a]">
                        {entry.documentType}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono font-medium text-indigo-300">
                      {entry.renamedFilename}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`font-semibold font-mono text-[11px] ${
                          entry.confidence >= 80
                            ? "text-green-400"
                            : entry.confidence >= 60
                            ? "text-yellow-500"
                            : "text-red-400"
                        }`}
                      >
                        {entry.confidence}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {entry.status === "Approved" && (
                        <span className="inline-flex items-center space-x-1 text-green-400 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved</span>
                        </span>
                      )}
                      {entry.status === "Rejected" && (
                        <span className="inline-flex items-center space-x-1 text-red-400 font-semibold text-[11px]">
                          <XCircle className="w-3 h-3" />
                          <span>Rejected</span>
                        </span>
                      )}
                      {entry.status === "Manual Edit" && (
                        <span className="inline-flex items-center space-x-1 text-yellow-500 font-semibold text-[11px]">
                          <span>Manual Edit</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
