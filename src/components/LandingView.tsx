import React from "react";
import {
  Sparkles,
  ShieldCheck,
  HardDrive,
  Terminal,
  ArrowRight,
  Sliders,
  Play
} from "lucide-react";
import { SAMPLE_DOCUMENTS } from "../data/sampleDocuments";

interface LandingViewProps {
  onEnterWorkspace: () => void;
  onTrySample: (sampleId: string) => void;
  onOpenAuth: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterWorkspace,
  onTrySample,
}) => {
  return (
    <div className="space-y-12 py-4 sm:py-8 animate-in fade-in duration-150">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono font-medium">
          <Sparkles className="w-3 h-3" />
          <span>Multimodal Vision File Renaming Engine</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Intelligent Document Organization &amp;{" "}
          <span className="text-indigo-400">Structured Filename AI</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#888] max-w-xl mx-auto leading-relaxed">
          Transform unreadable scans, deeds, invoices, and medical reports into standardized, filesystem-safe filenames with strict visual grounding.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            type="button"
            id="hero-start-workspace-btn"
            onClick={onEnterWorkspace}
            className="px-4 py-2 text-xs font-bold rounded bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <span>Open Document Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onTrySample("sample_sale_deed_1998")}
            className="px-3.5 py-2 text-xs font-semibold rounded bg-[#1c1c1c] hover:bg-[#262626] text-[#e5e5e5] border border-[#333] transition-colors flex items-center space-x-1.5"
          >
            <Play className="w-3 h-3 fill-current text-indigo-400" />
            <span>Try Sale Deed Sample (1998)</span>
          </button>
        </div>

        {/* Local-First Architecture Badge */}
        <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-[#666]">
          <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            <strong>Architected for 5GB–20GB+ Archives:</strong> Process local disks without uploading huge folders.
          </span>
        </div>
      </div>

      {/* Interactive Live Comparison Card */}
      <div className="max-w-4xl mx-auto bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
          <div>
            <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest">
              Ground-Truth Vision Analysis
            </h3>
            <p className="text-xs text-white font-medium mt-0.5">
              Converting ambiguous camera captures to standardized filenames
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold font-mono">
            Grounding Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Input Side */}
          <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-[#2a2a2a] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
              Input Document (Raw Camera Scan)
            </span>
            <div className="p-2 bg-[#161616] rounded border border-[#2a2a2a] font-mono text-xs text-[#aaa]">
              IMG_83921.jpg
            </div>
            <p className="text-[11px] text-[#777] leading-relaxed">
              <strong>Visible Document Text:</strong> Registered property sale deed executed in 1998 for Survey 123/4 at Gollakuppam registration office.
            </p>
          </div>

          {/* AI Output Side */}
          <div className="p-3.5 rounded-lg bg-[#0d0d0d] border border-indigo-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>FileMind Suggested Filename</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-green-400">
                98% Conf
              </span>
            </div>
            <div className="p-2 bg-indigo-950/30 rounded border border-indigo-500/40 font-mono text-xs text-indigo-300 font-bold break-all">
              Sale_Deed_Survey_123-4_Gollakuppam_1998.jpg
            </div>
            <div className="flex flex-wrap gap-1 text-[9px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-[#161616] text-[#888] border border-[#2a2a2a]">
                Type: Sale Deed
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#161616] text-[#888] border border-[#2a2a2a]">
                Survey: 123/4
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#161616] text-[#888] border border-[#2a2a2a]">
                Year: 1998
              </span>
            </div>
          </div>
        </div>

        {/* 1-Click Sandbox Buttons */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="text-[11px] text-[#666] font-medium mr-1">Sample docs:</span>
          {SAMPLE_DOCUMENTS.map((s) => (
            <button
              key={s.id}
              onClick={() => onTrySample(s.id)}
              className="px-2.5 py-1 text-[11px] rounded bg-[#161616] hover:bg-[#222] text-[#ccc] border border-[#2a2a2a] transition-colors"
            >
              {s.docTypeHint} ({s.name})
            </button>
          ))}
        </div>
      </div>

      {/* Feature Triplets */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Strict Vision Grounding
          </h3>
          <p className="text-xs text-[#777] leading-relaxed">
            Never invents details. Missing or obscured text is omitted or flagged with human review warnings.
          </p>
        </div>

        <div className="p-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Custom Naming Rules
          </h3>
          <p className="text-xs text-[#777] leading-relaxed">
            Configure custom delimiters, casing (PascalCase, snake_case), and token arrangements.
          </p>
        </div>

        <div className="p-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Terminal className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Desktop CLI Agent
          </h3>
          <p className="text-xs text-[#777] leading-relaxed">
            Organize 20GB+ archives locally with generated Python, Bash, and PowerShell scripts.
          </p>
        </div>
      </div>
    </div>
  );
};
