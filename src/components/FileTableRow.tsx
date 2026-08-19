import React, { useState } from "react";
import {
  Check,
  X,
  Edit2,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Save,
  FileText
} from "lucide-react";
import { FileItem } from "../types";
import { formatFileSize } from "../utils/fileUtils";

interface FileTableRowProps {
  item: FileItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onUpdateFilename: (id: string, newName: string) => void;
  onReanalyze: (id: string) => void;
  onInspect: (item: FileItem) => void;
  isSelected?: boolean;
}

export const FileTableRow: React.FC<FileTableRowProps> = ({
  item,
  onApprove,
  onReject,
  onUpdateFilename,
  onReanalyze,
  onInspect,
  isSelected = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(
    item.editedFilename || item.suggestedFilename || item.name
  );

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdateFilename(item.id, editValue.trim());
      setIsEditing(false);
    }
  };

  const confidence = item.aiResult?.confidence ?? 0;
  const isPDF = item.extension.toLowerCase() === ".pdf";

  return (
    <tr
      id={`table-row-${item.id}`}
      onClick={() => onInspect(item)}
      className={`group cursor-pointer border-b border-[#1a1a1a] transition-colors text-xs ${
        isSelected
          ? "bg-[#1a1a1a]/60 border-l-2 border-indigo-500"
          : item.status === "approved"
          ? "bg-emerald-950/15 hover:bg-emerald-950/25"
          : item.status === "rejected"
          ? "bg-rose-950/15 opacity-70 hover:bg-rose-950/25"
          : "hover:bg-[#111]"
      }`}
    >
      {/* File & Thumbnail */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 border ${
              isPDF
                ? "bg-red-950/30 text-red-400 border-red-900/40"
                : "bg-[#222] text-[#888] border-[#333]"
            }`}
          >
            {item.previewUrl && !isPDF ? (
              <img
                src={item.previewUrl}
                alt=""
                className="w-full h-full object-cover rounded"
                referrerPolicy="no-referrer"
              />
            ) : (
              item.extension.replace(".", "").toUpperCase().slice(0, 3) || "DOC"
            )}
          </div>
          <div className="flex flex-col min-w-0 max-w-[180px] sm:max-w-[220px]">
            <span
              className="font-medium text-[#e5e5e5] truncate font-mono text-xs"
              title={item.originalFilename}
            >
              {item.originalFilename}
            </span>
            <span className="text-[11px] text-[#666]">
              {formatFileSize(item.size)}
            </span>
          </div>
        </div>
      </td>

      {/* Detected Document Type */}
      <td className="py-3 px-4 text-[#aaa] whitespace-nowrap">
        <span className="text-xs">
          {item.aiResult?.document_type || "Analyzing..."}
        </span>
      </td>

      {/* Suggested Filename (Editable) */}
      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
        {isEditing ? (
          <div className="flex items-center space-x-1.5 min-w-[220px]">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="flex-1 text-xs font-mono bg-[#161616] border border-indigo-500 rounded px-2 py-1 text-indigo-300 focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1 rounded bg-[#222] text-[#888] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 group/edit">
            <span
              className="font-mono text-indigo-300 font-medium truncate max-w-[220px] lg:max-w-[300px]"
              title={item.suggestedFilename}
            >
              {item.editedFilename || item.suggestedFilename || "—"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditValue(item.editedFilename || item.suggestedFilename);
                setIsEditing(true);
              }}
              className="opacity-0 group-hover/edit:opacity-100 p-1 rounded text-[#888] hover:text-white hover:bg-[#222] transition-opacity"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </td>

      {/* AI Confidence Meter matching High Density theme */}
      <td className="py-3 px-4 text-center whitespace-nowrap">
        {item.aiResult ? (
          <div className="flex flex-col items-center gap-1">
            <span
              className={`text-xs font-bold ${
                confidence >= 80
                  ? "text-green-500"
                  : confidence >= 60
                  ? "text-yellow-500"
                  : "text-red-400"
              }`}
            >
              {confidence}%
            </span>
            <div className="w-16 h-1 bg-[#222] rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  confidence >= 80
                    ? "bg-green-500"
                    : confidence >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="text-[#555] text-xs font-mono">--</span>
        )}
      </td>

      {/* Status Pill Badge */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        {item.status === "approved" && (
          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-semibold border border-green-500/20">
            Approved
          </span>
        )}
        {item.status === "rejected" && (
          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-semibold border border-red-500/20">
            Rejected
          </span>
        )}
        {item.status === "completed" && (
          <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-semibold border border-yellow-500/20">
            Reviewing
          </span>
        )}
        {item.status === "analyzing" && (
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold border border-indigo-500/20 animate-pulse flex items-center gap-1 inline-flex">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            <span>Analyzing</span>
          </span>
        )}
        {item.status === "queued" && (
          <span className="px-2 py-0.5 rounded-full bg-[#222] text-[#888] text-[10px] border border-[#333]">
            Queued
          </span>
        )}
        {item.status === "error" && (
          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] border border-red-500/20">
            Error
          </span>
        )}
      </td>

      {/* Action Buttons */}
      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end space-x-1.5">
          <button
            type="button"
            onClick={() => onInspect(item)}
            className="p-1 text-[#888] hover:text-white rounded hover:bg-[#222]"
            title="Inspect Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onReject(item.id)}
            className={`p-1 rounded ${
              item.status === "rejected"
                ? "bg-red-900/40 text-red-300 border border-red-700"
                : "text-[#888] hover:text-red-400 hover:bg-[#222]"
            }`}
            title="Reject"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onApprove(item.id)}
            className={`px-2 py-1 rounded text-xs font-semibold ${
              item.status === "approved"
                ? "bg-green-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            }`}
            title="Approve"
          >
            <Check className="w-3 h-3 inline mr-1" />
            <span>Approve</span>
          </button>
        </div>
      </td>
    </tr>
  );
};
