import React, { useState } from "react";
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Terminal,
  LayoutGrid,
  List,
  Search,
  Check,
  RefreshCw,
  HardDrive,
  Play,
  RotateCcw,
  Eye,
  Sliders
} from "lucide-react";
import confetti from "canvas-confetti";
import { FileItem, NamingTemplate, UserStats } from "../types";
import { UploadDropzone } from "./UploadDropzone";
import { FileCard } from "./FileCard";
import { FileTableRow } from "./FileTableRow";
import { FileDetailModal } from "./FileDetailModal";
import { downloadRenamedZip, generateLocalRenameScript } from "../utils/fileUtils";

interface DashboardViewProps {
  files: FileItem[];
  stats: UserStats;
  isProcessing: boolean;
  activeTemplate: NamingTemplate;
  onFilesSelected: (files: File[]) => void;
  onLoadSample: (sampleId: string) => void;
  onLoadAllSamples: () => void;
  onApproveFile: (id: string) => void;
  onRejectFile: (id: string) => void;
  onUpdateFilename: (id: string, newName: string) => void;
  onReanalyzeFile: (id: string) => void;
  onBulkApprove: () => void;
  onProcessQueued: () => void;
  onClearAll: () => void;
  onNavigateToTemplates: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  files,
  stats,
  isProcessing,
  activeTemplate,
  onFilesSelected,
  onLoadSample,
  onLoadAllSamples,
  onApproveFile,
  onRejectFile,
  onUpdateFilename,
  onReanalyzeFile,
  onBulkApprove,
  onProcessQueued,
  onClearAll,
  onNavigateToTemplates,
}) => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [inspectingItem, setInspectingItem] = useState<FileItem | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [scriptModalType, setScriptModalType] = useState<"bash" | "powershell" | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // Filtered files
  const filteredFiles = files.filter((f) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      f.originalFilename.toLowerCase().includes(term) ||
      (f.suggestedFilename || "").toLowerCase().includes(term) ||
      (f.aiResult?.document_type || "").toLowerCase().includes(term);

    const confidence = f.aiResult?.confidence ?? 0;

    let matchesFilter = true;
    if (filterStatus === "review") {
      matchesFilter = f.status === "completed" || (confidence < 75 && f.status !== "approved" && f.status !== "rejected");
    } else if (filterStatus === "approved") {
      matchesFilter = f.status === "approved";
    } else if (filterStatus === "rejected") {
      matchesFilter = f.status === "rejected";
    } else if (filterStatus === "low_conf") {
      matchesFilter = confidence > 0 && confidence < 60;
    } else if (filterStatus === "analyzing") {
      matchesFilter = f.status === "analyzing" || f.status === "queued";
    }

    return matchesSearch && matchesFilter;
  });

  const queuedCount = files.filter((f) => f.status === "queued").length;
  const approvedCount = files.filter((f) => f.status === "approved").length;
  const reviewCount = files.filter(
    (f) => f.status === "completed" || ((f.aiResult?.confidence || 0) < 75 && f.status !== "approved" && f.status !== "rejected")
  ).length;

  const activeSelectedFile = files.find((f) => f.id === selectedFileId) || filteredFiles[0] || null;

  const handleBulkApproveWithConfetti = () => {
    onBulkApprove();
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleExportZip = async () => {
    await downloadRenamedZip(files);
  };

  return (
    <div className="space-y-5">
      {/* 5 Core High Density Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Files Analyzed */}
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-[#888] uppercase tracking-widest">
              Files Analyzed
            </span>
            <div className="w-5 h-5 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileCheck2 className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <span className="text-xl font-bold text-white font-mono">
              {stats.filesAnalyzed}
            </span>
            <p className="text-[10px] text-[#666] mt-0.5">
              Multimodal processed
            </p>
          </div>
        </div>

        {/* Metric 2: Requiring Review */}
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest">
              Review Required
            </span>
            <div className="w-5 h-5 rounded bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
              <AlertTriangle className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <span className="text-xl font-bold text-yellow-500 font-mono">
              {stats.filesRequiringReview}
            </span>
            <p className="text-[10px] text-[#666] mt-0.5">
              Pending confirmation
            </p>
          </div>
        </div>

        {/* Metric 3: Approved */}
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">
              Approved
            </span>
            <div className="w-5 h-5 rounded bg-green-500/10 text-green-400 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <span className="text-xl font-bold text-green-500 font-mono">
              {stats.filesRenamed}
            </span>
            <p className="text-[10px] text-[#666] mt-0.5">
              Ready for rename
            </p>
          </div>
        </div>

        {/* Metric 4: Low Confidence */}
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-[#888] uppercase tracking-widest">
              Low Confidence
            </span>
            <div className="w-5 h-5 rounded bg-red-500/10 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <span className="text-xl font-bold text-[#ccc] font-mono">
              {stats.lowConfidenceCount}
            </span>
            <p className="text-[10px] text-[#666] mt-0.5">
              &lt;60% confidence
            </p>
          </div>
        </div>

        {/* Metric 5: Speed */}
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-3.5 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-[#888] uppercase tracking-widest">
              Latency
            </span>
            <div className="w-5 h-5 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Clock className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5">
            <span className="text-xl font-bold text-indigo-300 font-mono">
              {stats.filesAnalyzed > 0
                ? `${Math.round(stats.totalProcessingTimeMs / stats.filesAnalyzed / 100) / 10}s`
                : "1.2s"}
            </span>
            <p className="text-[10px] text-[#666] mt-0.5">
              Avg per document
            </p>
          </div>
        </div>
      </div>

      {/* Active Upload Dropzone */}
      <UploadDropzone
        onFilesSelected={onFilesSelected}
        onLoadSample={onLoadSample}
        onLoadAllSamples={onLoadAllSamples}
        isProcessing={isProcessing}
      />

      {/* Active Processing / Queue Banner */}
      {queuedCount > 0 && (
        <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-lg flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
            <div>
              <h4 className="text-xs font-semibold text-white">
                {queuedCount} Document{queuedCount > 1 ? "s" : ""} Queued for AI Analysis
              </h4>
              <p className="text-[11px] text-[#888]">
                Active Template: <span className="font-mono text-indigo-300 font-semibold">{activeTemplate.pattern}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onProcessQueued}
            disabled={isProcessing}
            className="px-3.5 py-1.5 text-xs font-bold rounded-md bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isProcessing ? "Analyzing..." : "Process Queue"}</span>
          </button>
        </div>
      )}

      {/* File Collection Workspace Area */}
      {files.length > 0 && (
        <div className="space-y-3">
          {/* Workspace Toolbar: Filter, Search, Bulk Actions */}
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 shadow-sm">
            {/* Left: Search & Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[180px] sm:min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-[#666] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter files..."
                  className="w-full text-xs bg-[#161616] border border-[#333] rounded pl-7 pr-3 py-1.5 text-[#e5e5e5] focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center space-x-1 bg-[#161616] p-0.5 rounded border border-[#2a2a2a] text-xs">
                <button
                  type="button"
                  onClick={() => setFilterStatus("all")}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                    filterStatus === "all"
                      ? "bg-[#262626] text-white font-medium"
                      : "text-[#888] hover:text-white"
                  }`}
                >
                  All ({files.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus("review")}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                    filterStatus === "review"
                      ? "bg-yellow-500/20 text-yellow-500 font-bold"
                      : "text-[#888] hover:text-yellow-500"
                  }`}
                >
                  Review ({reviewCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus("approved")}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                    filterStatus === "approved"
                      ? "bg-green-500/20 text-green-400 font-bold"
                      : "text-[#888] hover:text-green-400"
                  }`}
                >
                  Approved ({approvedCount})
                </button>
              </div>
            </div>

            {/* Right: View mode toggle & Bulk Actions matching Design HTML */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Bulk Approve */}
              <button
                type="button"
                id="bulk-approve-btn"
                onClick={handleBulkApproveWithConfetti}
                disabled={files.length === 0}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Bulk Approve All</span>
              </button>

              {/* Export ZIP */}
              <button
                type="button"
                id="export-zip-btn"
                onClick={handleExportZip}
                disabled={approvedCount === 0 && files.filter((f) => f.status === "completed").length === 0}
                className="px-3 py-1.5 text-xs font-medium rounded bg-[#1c1c1c] hover:bg-[#262626] text-[#e5e5e5] border border-[#333] transition-colors flex items-center space-x-1.5 disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export ZIP ({approvedCount || files.length})</span>
              </button>

              {/* Shell Script Modal Trigger */}
              <button
                type="button"
                onClick={() => setScriptModalType("bash")}
                className="px-2.5 py-1.5 text-xs font-medium rounded bg-[#1c1c1c] hover:bg-[#262626] text-[#aaa] border border-[#333] transition-colors flex items-center space-x-1"
                title="Generate local Bash/PowerShell rename commands"
              >
                <Terminal className="w-3.5 h-3.5 text-[#888]" />
                <span>Script</span>
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-[#161616] p-0.5 rounded border border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1 rounded ${
                    viewMode === "table" ? "bg-[#262626] text-indigo-400" : "text-[#888]"
                  }`}
                  title="Table view"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded ${
                    viewMode === "grid" ? "bg-[#262626] text-indigo-400" : "text-[#888]"
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Clear */}
              <button
                type="button"
                onClick={onClearAll}
                className="p-1.5 text-[#888] hover:text-red-400 hover:bg-[#222] rounded transition-colors"
                title="Clear current workspace list"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Files Rendering: Table or Grid */}
          {filteredFiles.length === 0 ? (
            <div className="p-10 text-center bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl space-y-2">
              <p className="text-xs text-[#888] font-medium">
                No documents match the current filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilterStatus("all");
                  setSearchTerm("");
                }}
                className="text-xs text-indigo-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  item={file}
                  onApprove={onApproveFile}
                  onReject={onRejectFile}
                  onUpdateFilename={onUpdateFilename}
                  onReanalyze={onReanalyzeFile}
                  onInspect={(item) => setInspectingItem(item)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] text-[#555] uppercase border-b border-[#2a2a2a] bg-[#0d0d0d]">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Original Filename</th>
                      <th className="py-2.5 px-4 font-semibold">Type</th>
                      <th className="py-2.5 px-4 font-semibold">Suggested Filename</th>
                      <th className="py-2.5 px-4 font-semibold text-center">AI Confidence</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {filteredFiles.map((file) => (
                      <FileTableRow
                        key={file.id}
                        item={file}
                        onApprove={onApproveFile}
                        onReject={onRejectFile}
                        onUpdateFilename={onUpdateFilename}
                        onReanalyze={onReanalyzeFile}
                        onInspect={(item) => {
                          setSelectedFileId(item.id);
                          setInspectingItem(item);
                        }}
                        isSelected={selectedFileId === file.id}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Realistic Empty State when no files are loaded */}
      {files.length === 0 && (
        <div className="p-10 text-center bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#161616] border border-[#2a2a2a] flex items-center justify-center text-[#666] mx-auto">
            <HardDrive className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Workspace Idle
            </h3>
            <p className="text-xs text-[#888] leading-relaxed">
              Upload documents or click any ground-truth sample below to test multimodal filename generation in real-time.
            </p>
          </div>

          <div className="pt-1 flex items-center justify-center space-x-2 text-xs">
            <button
              type="button"
              onClick={onLoadAllSamples}
              className="px-3.5 py-1.5 font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
            >
              Load 5 Sample Documents
            </button>
            <button
              type="button"
              onClick={onNavigateToTemplates}
              className="px-3 py-1.5 font-medium rounded bg-[#1c1c1c] text-[#ccc] border border-[#333] hover:bg-[#262626] transition-colors"
            >
              Configure Naming Rules
            </button>
          </div>
        </div>
      )}

      {/* File Detail Inspection Modal */}
      <FileDetailModal
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        onApprove={onApproveFile}
        onReject={onRejectFile}
        onUpdateFilename={onUpdateFilename}
        onReanalyze={onReanalyzeFile}
      />

      {/* Rename Script Preview Modal */}
      {scriptModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl w-full max-w-2xl overflow-hidden p-5 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-2.5">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Local Rename Script ({scriptModalType === "bash" ? "Bash / macOS / Linux" : "Windows PowerShell"})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setScriptModalType(null)}
                className="text-[#888] hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#888]">
              Run this script directly in your terminal inside the folder containing your original files to rename them locally with collision protection.
            </p>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setScriptModalType("bash")}
                className={`px-3 py-1 text-xs font-semibold rounded ${
                  scriptModalType === "bash"
                    ? "bg-indigo-600 text-white"
                    : "bg-[#1c1c1c] text-[#888] border border-[#2a2a2a]"
                }`}
              >
                Bash (macOS / Linux)
              </button>
              <button
                type="button"
                onClick={() => setScriptModalType("powershell")}
                className={`px-3 py-1 text-xs font-semibold rounded ${
                  scriptModalType === "powershell"
                    ? "bg-indigo-600 text-white"
                    : "bg-[#1c1c1c] text-[#888] border border-[#2a2a2a]"
                }`}
              >
                PowerShell (Windows)
              </button>
            </div>

            <pre className="p-3 text-xs font-mono bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-indigo-300 overflow-x-auto max-h-[240px]">
              {generateLocalRenameScript(files, scriptModalType)}
            </pre>

            <div className="flex justify-end space-x-2 pt-2 border-t border-[#2a2a2a]">
              <button
                type="button"
                onClick={() => setScriptModalType(null)}
                className="px-3.5 py-1.5 text-xs text-[#888] hover:text-white bg-[#1c1c1c] rounded border border-[#333]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    generateLocalRenameScript(files, scriptModalType)
                  );
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-500 flex items-center space-x-1.5 shadow-sm"
              >
                {copiedScript ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
