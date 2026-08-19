import React, { useState } from "react";
import {
  Check,
  X,
  Edit2,
  Sparkles,
  AlertTriangle,
  FileText,
  FileImage,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Tag,
  Save,
  RotateCcw
} from "lucide-react";
import { FileItem } from "../types";
import { formatFileSize } from "../utils/fileUtils";

interface FileCardProps {
  item: FileItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onUpdateFilename: (id: string, newName: string) => void;
  onReanalyze: (id: string) => void;
  onInspect: (item: FileItem) => void;
}

export const FileCard: React.FC<FileCardProps> = ({
  item,
  onApprove,
  onReject,
  onUpdateFilename,
  onReanalyze,
  onInspect,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(
    item.editedFilename || item.suggestedFilename || item.name
  );
  const [showFields, setShowFields] = useState(false);

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      onUpdateFilename(item.id, editValue.trim());
      setIsEditing(false);
    }
  };

  const handleResetEdit = () => {
    const originalSuggestion = item.aiResult?.suggested_filename || item.originalFilename;
    setEditValue(originalSuggestion);
    onUpdateFilename(item.id, originalSuggestion);
    setIsEditing(false);
  };

  const confidence = item.aiResult?.confidence ?? 0;
  const isHighConf = confidence >= 80;
  const isMedConf = confidence >= 60 && confidence < 80;
  const isPDF = item.extension.toLowerCase() === ".pdf";

  // Status-based border & badge styles
  const getStatusBadge = () => {
    switch (item.status) {
      case "approved":
        return (
          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-semibold border border-green-500/20">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-semibold border border-red-500/20">
            Rejected
          </span>
        );
      case "analyzing":
        return (
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold border border-indigo-500/20 animate-pulse flex items-center gap-1">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            <span>Analyzing</span>
          </span>
        );
      case "queued":
        return (
          <span className="px-2 py-0.5 rounded-full bg-[#222] text-[#888] text-[10px] border border-[#333]">
            Queued
          </span>
        );
      case "error":
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] border border-red-500/20">
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-semibold border border-yellow-500/20">
            Reviewing
          </span>
        );
    }
  };

  return (
    <div
      id={`file-card-${item.id}`}
      className={`bg-[#0d0d0d] border rounded-xl p-4 transition-colors flex flex-col justify-between ${
        item.status === "approved"
          ? "border-green-500/40 bg-[#0d130f]"
          : item.status === "rejected"
          ? "border-red-900/40 opacity-75"
          : item.status === "error"
          ? "border-red-900/50"
          : "border-[#2a2a2a] hover:border-[#3a3a3a]"
      }`}
    >
      <div>
        {/* Card Header: Preview Thumbnail + Type + Status */}
        <div className="flex items-start space-x-3 pb-3 border-b border-[#2a2a2a]">
          {/* Thumbnail preview button */}
          <button
            type="button"
            onClick={() => onInspect(item)}
            title="Inspect preview"
            className="relative w-12 h-14 rounded bg-[#161616] border border-[#2a2a2a] overflow-hidden flex-shrink-0 group hover:border-indigo-500/50 transition-colors flex items-center justify-center"
          >
            {item.previewUrl && !isPDF ? (
              <img
                src={item.previewUrl}
                alt={item.originalFilename}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            ) : isPDF ? (
              <FileText className="w-5 h-5 text-red-400" />
            ) : (
              <FileImage className="w-5 h-5 text-[#666]" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Header Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#161616] text-[#ccc] border border-[#2a2a2a] uppercase tracking-wider truncate">
                {item.aiResult?.document_type || "Detecting..."}
              </span>
              {getStatusBadge()}
            </div>

            {/* Original filename */}
            <div className="mt-1">
              <p className="text-[11px] text-[#888] font-mono truncate" title={item.originalFilename}>
                {item.originalFilename}
              </p>
              <p className="text-[10px] text-[#555]">
                {formatFileSize(item.size)} • {item.extension.toUpperCase() || "DOC"}
              </p>
            </div>
          </div>
        </div>

        {/* Suggested Filename Display & Editor */}
        <div className="py-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[10px] uppercase tracking-wider text-[#555]">
              Suggested Filename
            </span>

            {/* Confidence meter pill */}
            {item.aiResult && (
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-bold ${
                    isHighConf
                      ? "text-green-500"
                      : isMedConf
                      ? "text-yellow-500"
                      : "text-red-400"
                  }`}
                >
                  {confidence}%
                </span>
                <div className="w-12 h-1 bg-[#222] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      isHighConf
                        ? "bg-green-500"
                        : isMedConf
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Editable box */}
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                className="w-full text-xs font-mono bg-[#161616] border border-indigo-500 rounded px-2.5 py-1.5 text-indigo-300 focus:outline-none"
                autoFocus
              />
              <div className="flex items-center justify-end space-x-1.5">
                <button
                  type="button"
                  onClick={handleResetEdit}
                  title="Reset to initial AI suggestion"
                  className="px-2 py-1 text-[10px] rounded text-[#888] hover:text-white bg-[#1c1c1c] transition-colors flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 text-[10px] rounded text-[#888] hover:text-white bg-[#1c1c1c] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-2.5 py-1 text-[10px] font-semibold rounded bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center space-x-1"
                >
                  <Save className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="group relative bg-[#161616] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded p-2 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <p
                  className="text-xs font-mono text-indigo-300 font-medium break-all leading-snug"
                  title={item.suggestedFilename}
                >
                  {item.editedFilename || item.suggestedFilename || "Analyzing..."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditValue(item.editedFilename || item.suggestedFilename);
                    setIsEditing(true);
                  }}
                  title="Edit suggested filename"
                  className="p-1 rounded text-[#888] hover:text-white hover:bg-[#222] transition-colors flex-shrink-0"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>

              {item.isEdited && (
                <div className="mt-1 flex items-center space-x-1 text-[9px] text-yellow-500 font-semibold uppercase tracking-wider">
                  <span>(Edited)</span>
                </div>
              )}
            </div>
          )}

          {/* Reasoning & Extracted Data summary */}
          {item.aiResult && (
            <div className="mt-2 text-xs space-y-1.5">
              <p className="text-[11px] text-[#888] leading-normal italic">
                {item.aiResult.reasoning_summary}
              </p>

              {/* Warning Banner */}
              {item.aiResult.warnings && item.aiResult.warnings.length > 0 && (
                <div className="flex items-start space-x-1.5 p-2 rounded bg-yellow-950/20 border border-yellow-900/30 text-yellow-500/90 text-[10px]">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5 text-yellow-500" />
                  <div>
                    {item.aiResult.warnings.map((w, idx) => (
                      <p key={idx}>{w}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Collapsible Key Fields Bar */}
              {item.aiResult.extracted_fields &&
                Object.keys(item.aiResult.extracted_fields).length > 0 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowFields(!showFields)}
                      className="text-[10px] text-[#888] hover:text-[#ccc] flex items-center space-x-1 py-0.5 uppercase tracking-wider font-semibold"
                    >
                      <Tag className="w-3 h-3 text-[#666]" />
                      <span>
                        {showFields ? "Hide fields" : "Extracted fields"}
                      </span>
                    </button>

                    {showFields && (
                      <div className="grid grid-cols-2 gap-1 p-2 bg-[#161616] rounded border border-[#222] text-[10px] mt-1">
                        {item.aiResult.extracted_fields.entity_name && (
                          <div className="truncate">
                            <span className="text-[#555] font-bold block text-[9px]">ENTITY</span>
                            <span className="text-[#ddd]">
                              {item.aiResult.extracted_fields.entity_name}
                            </span>
                          </div>
                        )}
                        {item.aiResult.extracted_fields.date && (
                          <div className="truncate">
                            <span className="text-[#555] font-bold block text-[9px]">DATE</span>
                            <span className="text-[#ddd]">
                              {item.aiResult.extracted_fields.date}
                            </span>
                          </div>
                        )}
                        {item.aiResult.extracted_fields.identifier && (
                          <div className="truncate">
                            <span className="text-[#555] font-bold block text-[9px]">ID</span>
                            <span className="text-[#ddd] font-mono">
                              {item.aiResult.extracted_fields.identifier}
                            </span>
                          </div>
                        )}
                        {item.aiResult.extracted_fields.location && (
                          <div className="truncate">
                            <span className="text-[#555] font-bold block text-[9px]">LOCATION</span>
                            <span className="text-[#ddd]">
                              {item.aiResult.extracted_fields.location}
                            </span>
                          </div>
                        )}
                        {item.aiResult.extracted_fields.amount && (
                          <div className="truncate">
                            <span className="text-[#555] font-bold block text-[9px]">AMOUNT</span>
                            <span className="text-green-400 font-semibold">
                              {item.aiResult.extracted_fields.amount}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-[#2a2a2a] flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => onReanalyze(item.id)}
            disabled={item.status === "analyzing"}
            title="Re-run AI Analysis"
            className="p-1.5 text-[#888] hover:text-white hover:bg-[#222] rounded transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${item.status === "analyzing" ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => onInspect(item)}
            title="Inspect detail"
            className="p-1.5 text-[#888] hover:text-white hover:bg-[#222] rounded transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Reject */}
          <button
            type="button"
            id={`reject-btn-${item.id}`}
            onClick={() => onReject(item.id)}
            className={`px-2.5 py-1 text-xs rounded font-semibold transition-colors flex items-center space-x-1 ${
              item.status === "rejected"
                ? "bg-red-900/40 text-red-300 border border-red-800"
                : "bg-[#222] hover:bg-[#333] text-[#888] hover:text-red-400 border border-[#333]"
            }`}
          >
            <X className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>

          {/* Approve */}
          <button
            type="button"
            id={`approve-btn-${item.id}`}
            onClick={() => onApprove(item.id)}
            disabled={item.status === "analyzing"}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors flex items-center space-x-1 ${
              item.status === "approved"
                ? "bg-green-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{item.status === "approved" ? "Approved" : "Approve"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
