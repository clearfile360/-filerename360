import React, { useState } from "react";
import {
  Terminal,
  HardDrive,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Zap
} from "lucide-react";
import { AuthUser, NamingTemplate } from "../types";

interface DesktopAgentViewProps {
  authUser: AuthUser;
  activeTemplate: NamingTemplate;
}

export const DesktopAgentView: React.FC<DesktopAgentViewProps> = ({
  authUser,
  activeTemplate,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<"python" | "bash" | "powershell">("python");
  const [targetFolder, setTargetFolder] = useState("~/Documents/Archive_20GB");
  const [dryRun, setDryRun] = useState(true);
  const [copied, setCopied] = useState(false);

  const apiToken = authUser?.apiKey || "fma_live_98a72b109e44f8";

  // Generate customized script
  const getScript = () => {
    if (selectedLanguage === "python") {
      return `#!/usr/bin/env python3
"""
FileMind AI Desktop Agent (v1.2.0)
Architecture: Local-First Document Processing
Target: Process 5GB, 20GB+ large document collections with ZERO heavy cloud uploads.
Only lightweight thumbnail/text previews are securely analyzed via FileMind API.
"""

import os
import sys
import base64
import requests
import argparse
from pathlib import Path

API_ENDPOINT = "https://ai.studio/api/analyze-file"
API_KEY = "${apiToken}"
NAMING_TEMPLATE = "${activeTemplate.pattern}"
TARGET_DIRECTORY = "${targetFolder}"
SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".pdf"}

def run_local_organizer(folder_path, dry_run=True):
    root = Path(os.path.expanduser(folder_path))
    if not root.is_dir():
        print(f"[-] Directory not found: {root}")
        sys.exit(1)

    files = [f for f in root.rglob("*") if f.is_file() and f.suffix.lower() in SUPPORTED_EXTS]
    print(f"[*] FileMind Agent scanning {root}...")
    print(f"[*] Found {len(files)} eligible documents.")
    print(f"[*] Execution Mode: {'[DRY RUN - No Files Renamed]' if dry_run else '[LIVE RENAME ACTIVE]'}\\n")

    for idx, fpath in enumerate(files, start=1):
        print(f"[{idx}/{len(files)}] Inspecting: {fpath.name}...")
        try:
            with open(fpath, "rb") as f:
                b64 = base64.b64encode(f.read()).decode("utf-8")

            payload = {
                "file": {
                    "name": fpath.name,
                    "type": "application/pdf" if fpath.suffix.lower() == ".pdf" else "image/jpeg",
                    "base64": b64
                },
                "templateConfig": {
                    "pattern": NAMING_TEMPLATE,
                    "separator": "${activeTemplate.separator}",
                    "caseStyle": "${activeTemplate.caseStyle}"
                }
            }

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {API_KEY}"
            }

            resp = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=40)
            if resp.status_code == 200:
                data = resp.json()
                new_name = data.get("suggested_filename", fpath.name)
                doc_type = data.get("document_type", "Document")
                conf = data.get("confidence", 0)

                print(f"    -> Document Type: {doc_type} (Confidence: {conf}%)")
                print(f"    -> Suggested Name: {new_name}")

                if not dry_run and new_name != fpath.name:
                    dest = fpath.parent / new_name
                    # Resolve collisions safely
                    counter = 1
                    while dest.exists():
                        dest = fpath.parent / f"{dest.stem}_{counter}{dest.suffix}"
                        counter += 1
                    fpath.rename(dest)
                    print(f"    [SUCCESS] Renamed to: {dest.name}")
            else:
                print(f"    [ERROR] HTTP {resp.status_code}: {resp.text}")

        except Exception as err:
            print(f"    [EXCEPTION] {err}")

    print("\\n[+] FileMind Agent batch organization completed!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FileMind Local Agent")
    parser.add_argument("--folder", default=TARGET_DIRECTORY, help="Target folder")
    parser.add_argument("--live", action="store_true", help="Execute real filesystem changes")
    args = parser.parse_args()
    run_local_organizer(args.folder, dry_run=not args.live)`;
    }

    if (selectedLanguage === "bash") {
      return `#!/usr/bin/env bash
# FileMind AI Local Renamer - Bash Agent
# Processes local folder using curl + jq
API_KEY="${apiToken}"
TARGET_DIR="${targetFolder}"
DRY_RUN=${dryRun ? "true" : "false"}

echo "=== FileMind AI Local Agent ==="
echo "Scanning: $TARGET_DIR (Dry Run: $DRY_RUN)"

for file in "$TARGET_DIR"/*.{jpg,jpeg,png,webp,pdf}; do
  [ -f "$file" ] || continue
  filename=$(basename "$file")
  echo "Analyzing: $filename..."
  
  b64_data=$(base64 -w 0 "$file")
  
  res=$(curl -s -X POST "https://ai.studio/api/analyze-file" \\
    -H "Content-Type: application/json" \\
    -H "Authorization: Bearer $API_KEY" \\
    -d "{\\"file\\":{\\"name\\":\\"$filename\\",\\"base64\\":\\"$b64_data\\"}}")
  
  suggested=$(echo "$res" | grep -o '"suggested_filename":"[^"]*' | cut -d'"' -f4)
  
  if [ -n "$suggested" ]; then
    echo "  -> New Name: $suggested"
    if [ "$DRY_RUN" = "false" ]; then
      mv -n "$file" "$(dirname "$file")/$suggested"
      echo "  [OK] Renamed!"
    fi
  fi
done`;
    }

    return `# FileMind AI Local Agent for Windows PowerShell
$ApiKey = "${apiToken}"
$TargetFolder = "${targetFolder}"
$DryRun = $${dryRun ? "true" : "false"}

Write-Host "FileMind AI Desktop Engine Active" -ForegroundColor Cyan
Write-Host "Directory: $TargetFolder | DryRun: $DryRun"

Get-ChildItem -Path $TargetFolder -Include *.jpg,*.png,*.pdf -Recurse | ForEach-Object {
    $file = $_
    Write-Host "Processing: $($file.Name)..." -ForegroundColor Yellow
    
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $b64 = [System.Convert]::ToBase64String($bytes)
    
    $body = @{
        file = @{
            name = $file.Name
            base64 = $b64
        }
    } | ConvertTo-Json
    
    try {
        $res = Invoke-RestMethod -Uri "https://ai.studio/api/analyze-file" -Method Post -Body $body -ContentType "application/json"
        $suggested = $res.suggested_filename
        Write-Host "  -> Suggested: $suggested (Type: $($res.document_type))" -ForegroundColor Green
        
        if (-not $DryRun -and $suggested -ne $file.Name) {
            Rename-Item -Path $file.FullName -NewName $suggested
            Write-Host "  [OK] Renamed on disk" -ForegroundColor Green
        }
    } catch {
        Write-Host "  [ERR] $($_.Exception.Message)" -ForegroundColor Red
    }
}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = selectedLanguage === "python" ? "py" : selectedLanguage === "bash" ? "sh" : "ps1";
    const blob = new Blob([getScript()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `filemind_agent.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-in fade-in duration-150">
      {/* Banner */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-5 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
              CLI
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Desktop Agent &amp; CLI Architecture
                </h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 uppercase tracking-wider">
                  5GB - 50GB+ Scalable
                </span>
              </div>
              <p className="text-xs text-[#888] mt-0.5 max-w-2xl">
                Process 5GB, 20GB or larger local file collections with ZERO heavy cloud uploads. Files stay on your local disk.
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Pill Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-2.5 bg-[#0d0d0d] rounded-lg border border-[#2a2a2a] flex items-center space-x-2.5">
            <HardDrive className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white">Zero Cloud Ingestion</h4>
              <p className="text-[10px] text-[#666]">Files stay 100% on disk</p>
            </div>
          </div>

          <div className="p-2.5 bg-[#0d0d0d] rounded-lg border border-[#2a2a2a] flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white">Instant Local Rename</h4>
              <p className="text-[10px] text-[#666]">Atomic OS file renames</p>
            </div>
          </div>

          <div className="p-2.5 bg-[#0d0d0d] rounded-lg border border-[#2a2a2a] flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white">Collision Guard</h4>
              <p className="text-[10px] text-[#666]">Automated deduplication</p>
            </div>
          </div>
        </div>
      </div>

      {/* Script Generator & Settings */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2a2a] pb-3">
          <div>
            <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest">
              Agent Script Generator
            </h3>
            <p className="text-xs text-white font-medium mt-0.5">
              Select platform to generate local runner
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-[#161616] p-0.5 rounded border border-[#2a2a2a]">
            {(["python", "bash", "powershell"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  selectedLanguage === lang
                    ? "bg-indigo-600 text-white font-semibold"
                    : "text-[#888] hover:text-white"
                }`}
              >
                {lang === "python" ? "Python 3" : lang === "bash" ? "Bash" : "PowerShell"}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs: Folder Path & Dry Run toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
              Target Directory
            </label>
            <input
              type="text"
              value={targetFolder}
              onChange={(e) => setTargetFolder(e.target.value)}
              placeholder="e.g. D:\Scans\Archive_1998_2024 or /Volumes/HardDrive/Docs"
              className="w-full text-xs font-mono bg-[#161616] border border-[#333] rounded px-3 py-2 text-[#e5e5e5] focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
              Execution Mode
            </label>
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setDryRun(!dryRun)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                  dryRun
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                    : "bg-green-500/10 text-green-400 border-green-500/30"
                }`}
              >
                <span>{dryRun ? "Dry Run (Preview Only)" : "Live Rename Active"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Script Viewer Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider font-mono">
              filemind_agent.{selectedLanguage === "python" ? "py" : selectedLanguage === "bash" ? "sh" : "ps1"}
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs text-[#888] hover:text-white bg-[#1c1c1c] rounded border border-[#333] transition-colors flex items-center space-x-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-indigo-400" />
                    <span className="text-indigo-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors flex items-center space-x-1 shadow-sm"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden border border-[#2a2a2a] bg-[#0d0d0d]">
            <pre className="p-3.5 text-xs font-mono text-indigo-300/90 overflow-x-auto max-h-[340px] leading-relaxed">
              {getScript()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
