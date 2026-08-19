import React, { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  FolderPlus,
  Sparkles,
  FileCheck2
} from "lucide-react";
import { SAMPLE_DOCUMENTS } from "../data/sampleDocuments";

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  onLoadSample: (sampleId: string) => void;
  onLoadAllSamples: () => void;
  isProcessing: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFilesSelected,
  onLoadSample,
  onLoadAllSamples,
  isProcessing,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles: File[] = [];
      const allowed = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];

      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const f = e.dataTransfer.files[i];
        const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
        if (
          allowed.includes(f.type) ||
          [".jpg", ".jpeg", ".png", ".webp", ".pdf"].includes(ext)
        ) {
          validFiles.push(f);
        }
      }

      if (validFiles.length > 0) {
        console.log("Files dropped", validFiles.length);
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      console.log("File input changed", filesArr.length);
      onFilesSelected(filesArr);
      e.target.value = "";
    }
  };

  return (
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-5 mb-5 shadow-sm relative">
      {/* Real HTML inputs using React refs with visually hidden styling (not display:none / hidden) */}
      <input
        ref={fileInputRef}
        id="file-upload-input"
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
        onChange={handleFileChange}
        className="absolute w-px h-px opacity-0 pointer-events-none -z-10 overflow-hidden"
        aria-label="Upload files"
      />
      <input
        ref={folderInputRef}
        id="folder-upload-input"
        type="file"
        // @ts-ignore
        webkitdirectory=""
        directory=""
        multiple
        onChange={handleFileChange}
        className="absolute w-px h-px opacity-0 pointer-events-none -z-10 overflow-hidden"
        aria-label="Upload folder"
      />

      {/* Dropzone container - ONLY handles drag events, no onClick */}
      <div
        id="file-dropzone-area"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-7 text-center transition-colors bg-[#0d0d0d] ${
          isDragOver
            ? "border-indigo-500 bg-indigo-950/20"
            : "border-[#333] hover:border-indigo-500/50"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#161616] border border-[#2a2a2a] flex items-center justify-center text-indigo-500 shadow-inner">
            <UploadCloud className="w-5 h-5" />
          </div>

          <div className="space-y-0.5">
            <p className="text-sm font-medium text-[#e5e5e5]">
              Drag files to start AI organization
            </p>
            <p className="text-xs text-[#888]">
              Upload PDF or images to analyze document contents and generate structured filenames
            </p>
          </div>

          {/* Action buttons inside dropzone using button + ref.current.click() */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              id="select-files-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Browse Files clicked");
                fileInputRef.current?.click();
              }}
              className="cursor-pointer select-none bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Browse Files</span>
            </button>

            <button
              id="select-folder-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Select Folder clicked");
                folderInputRef.current?.click();
              }}
              className="cursor-pointer select-none bg-[#1c1c1c] hover:bg-[#262626] text-[#e5e5e5] text-xs font-medium px-3.5 py-2 rounded-md border border-[#333] transition-colors flex items-center space-x-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#888]" />
              <span>Select Folder</span>
            </button>
          </div>

          {/* Supported format pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[10px] text-[#888]">
            <span className="uppercase tracking-wider font-semibold">Formats:</span>
            {["JPG", "PNG", "WEBP", "PDF"].map((fmt) => (
              <span key={fmt} className="px-1.5 py-0.5 rounded bg-[#161616] border border-[#2a2a2a] font-mono text-[#aaa]">
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Instant Realistic Sample Documents Toolbar */}
      <div className="mt-4 pt-3.5 border-t border-[#2a2a2a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center space-x-2 text-[#888]">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span className="font-medium text-[#ccc] text-xs">
            Test with ground-truth sample documents:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="load-all-samples-btn"
            onClick={onLoadAllSamples}
            disabled={isProcessing}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
          >
            + Load All 5 Samples
          </button>

          {SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              id={`load-sample-${sample.id}`}
              onClick={() => onLoadSample(sample.id)}
              disabled={isProcessing}
              title={sample.description}
              className="px-2 py-1 text-[11px] rounded bg-[#161616] hover:bg-[#222] text-[#bbb] border border-[#2a2a2a] transition-colors disabled:opacity-50 flex items-center space-x-1"
            >
              <FileCheck2 className="w-3 h-3 text-[#777]" />
              <span>{sample.docTypeHint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
