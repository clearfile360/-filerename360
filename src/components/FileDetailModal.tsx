import React, { useState } from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Edit2
} from "lucide-react";
import { FileItem } from "../types";
import { formatFileSize } from "../utils/fileUtils";

interface FileDetailModalProps {
  item: FileItem | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onUpdateFilename: (id: string, newName: string) => void;
  onReanalyze: (id: string) => void;
}

export const FileDetailModal: React.FC<FileDetailModalProps> = ({
  item,
  onClose,
  onApprove,
  onReject,
  onUpdateFilename,
  onReanalyze,
}) => {
  if (!item) return null;

  const [copied, setCopied] = useState(false);
  const [editedName, setEditedName] = useState(
    item.editedFilename || item.suggestedFilename || item.name
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      item.editedFilename || item.suggestedFilename || item.name
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    if (editedName.trim()) {
      onUpdateFilename(item.id, editedName.trim());
      setIsEditing(false);
    }
  };

  const confidence = item.aiResult?.confidence ?? 0;
  const isHighConf = confidence >= 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div
        className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#2a2a2a] bg-[#0f0f0f]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              F
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                AI Analysis &amp; Inspection Detail
              </h3>
              <p className="text-[11px] text-[#888] font-mono">
                {item.originalFilename} ({formatFileSize(item.size)})
              </p>
            </div>
          </div>

          <button
            id="close-detail-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#888] hover:text-white hover:bg-[#222] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Split view (Left: Preview, Right: Analysis details) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2a2a2a]">
          {/* Left Column: Visual Document Preview */}
          <div className="p-6 bg-[#0a0a0a] flex flex-col items-center justify-center min-h-[300px]">
            {item.previewUrl ? (
              <div className="relative max-h-[420px] w-full flex items-center justify-center overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#111]">
                <img
                  src={item.previewUrl}
                  alt={item.originalFilename}
                  className="max-h-[420px] max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="aspect-video bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-full flex items-center justify-center text-[#555] text-xs italic">
                Document Preview ({item.originalFilename})
              </div>
            )}
            <p className="text-[10px] text-[#555] mt-2 uppercase tracking-wider font-semibold">
              Native scan resolution
            </p>
          </div>

          {/* Right Column: AI Extraction & Details */}
          <div className="p-6 space-y-4 bg-[#0d0d0d]">
            {/* Suggested Filename Card */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-[#888] font-bold">
                  Suggested Filename
                </label>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[10px] text-[#888] hover:text-white flex items-center space-x-1 uppercase tracking-wider font-semibold"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-indigo-400" />
                      <span className="text-indigo-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full text-xs font-mono bg-[#161616] border border-indigo-500 rounded px-3 py-2 text-indigo-300 focus:outline-none"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-2.5 py-1 text-xs text-[#888] hover:text-white bg-[#222] rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-3 py-1 text-xs font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-500"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={item.editedFilename || item.suggestedFilename}
                    className="flex-1 bg-[#161616] border border-[#333] rounded px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-[#222] rounded border border-[#333] text-[#888] hover:text-white"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Extracted Metadata Grid matching Design HTML */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#888] font-bold mb-1.5">
                Extracted Fields
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#161616] p-2 rounded border border-[#222]">
                  <span className="block text-[9px] text-[#555] uppercase font-bold">TYPE</span>
                  <span className="text-[#ddd]">{item.aiResult?.document_type || "Document"}</span>
                </div>
                <div className="bg-[#161616] p-2 rounded border border-[#222]">
                  <span className="block text-[9px] text-[#555] uppercase font-bold">CONFIDENCE</span>
                  <span className={`font-semibold ${isHighConf ? "text-green-500" : "text-yellow-500"}`}>
                    {confidence}%
                  </span>
                </div>
                {item.aiResult?.extracted_fields?.entity_name && (
                  <div className="bg-[#161616] p-2 rounded border border-[#222]">
                    <span className="block text-[9px] text-[#555] uppercase font-bold">ENTITY</span>
                    <span className="text-[#ddd]">{item.aiResult.extracted_fields.entity_name}</span>
                  </div>
                )}
                {item.aiResult?.extracted_fields?.date && (
                  <div className="bg-[#161616] p-2 rounded border border-[#222]">
                    <span className="block text-[9px] text-[#555] uppercase font-bold">DATE</span>
                    <span className="text-[#ddd]">{item.aiResult.extracted_fields.date}</span>
                  </div>
                )}
                {item.aiResult?.extracted_fields?.identifier && (
                  <div className="bg-[#161616] p-2 rounded border border-[#222]">
                    <span className="block text-[9px] text-[#555] uppercase font-bold">IDENTIFIER</span>
                    <span className="text-[#ddd] font-mono">{item.aiResult.extracted_fields.identifier}</span>
                  </div>
                )}
                {item.aiResult?.extracted_fields?.location && (
                  <div className="bg-[#161616] p-2 rounded border border-[#222]">
                    <span className="block text-[9px] text-[#555] uppercase font-bold">LOCATION</span>
                    <span className="text-[#ddd]">{item.aiResult.extracted_fields.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Reasoning */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#888] font-bold mb-1.5">
                AI Reasoning
              </label>
              <p className="text-xs text-[#888] leading-relaxed italic bg-[#161616] p-2.5 rounded border border-[#222]">
                {item.aiResult?.reasoning_summary || "Visual analysis complete."}
              </p>
            </div>

            {/* Warnings if any */}
            {item.aiResult?.warnings && item.aiResult.warnings.length > 0 && (
              <div className="p-2.5 rounded bg-yellow-950/20 border border-yellow-900/30 text-yellow-500/90 text-xs space-y-1">
                <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-yellow-500">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Grounding Notes</span>
                </div>
                {item.aiResult.warnings.map((w, idx) => (
                  <p key={idx} className="text-[11px]">{w}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer matching High Density theme */}
        <div className="px-6 py-3.5 border-t border-[#2a2a2a] bg-[#0f0f0f] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onReanalyze(item.id);
              onClose();
            }}
            className="px-3 py-2 text-xs text-[#888] hover:text-white bg-[#1c1c1c] hover:bg-[#262626] rounded border border-[#333] transition-colors flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-analyze</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                onReject(item.id);
                onClose();
              }}
              className="px-5 py-2 text-xs font-semibold bg-[#222] hover:bg-[#333] text-[#888] hover:text-red-400 rounded border border-[#333] transition-colors"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => {
                onApprove(item.id);
                onClose();
              }}
              className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-all shadow-md shadow-indigo-600/10 flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve &amp; Rename</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
