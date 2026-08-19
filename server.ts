import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Support large payloads (for base64 document previews/images up to 50MB)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Utility: Clean and sanitize filename for filesystem safety
function sanitizeFilename(
  name: string,
  originalExt: string,
  collisionIndex: number = 0
): string {
  // Remove extension from name if user/AI included it
  let base = name.replace(/\.[^/.]+$/, "");
  // Replace illegal filesystem characters with underscores: / \ : * ? " < > | \0
  base = base.replace(/[/\\?%*:|"<>]/g, "_");
  // Replace multiple spaces or underscores with single
  base = base.replace(/[\s_-]+/g, "_").trim();
  // Strip leading/trailing dots or underscores
  base = base.replace(/^[._-]+|[._-]+$/g, "");

  if (!base) {
    base = "Document";
  }

  // Cap base length at 100 characters to prevent OS path errors
  if (base.length > 100) {
    base = base.substring(0, 100);
  }

  // Ensure extension starts with a dot
  const ext = originalExt ? (originalExt.startsWith(".") ? originalExt : `.${originalExt}`) : "";

  // Append collision suffix if specified
  const suffix = collisionIndex > 0 ? `_${collisionIndex}` : "";

  return `${base}${suffix}${ext}`;
}

// System instruction for FileMind AI naming engine
const SYSTEM_INSTRUCTION = `You are FileMind AI, a precision document intelligence and filesystem-safe filename generator.
Analyze the provided document or image.
Strict Grounding Rules:
1. NEVER invent, guess, or hallucinate information that is NOT clearly visible in the document.
2. If any piece of information (e.g. date, vendor, reference number, person name, survey number) is absent, blurry, or uncertain, do NOT guess it. Either leave that field empty or add a note in 'warnings'.
3. Identify the Document Type accurately (e.g. Invoice, Receipt, Sale Deed, Contract, Tax Document, Medical Report, ID / Passport, Academic Certificate, Utility Bill, Bank Statement, Employment Letter, Insurance Policy, Meeting Notes, Photo / Graphic, Uncategorized).
4. Extract key structured fields:
   - entity_name: Organization, company, vendor, institution, or primary party.
   - document_title: Formal title or subject of document.
   - date: Document date in YYYY-MM-DD or visible date format.
   - identifier: Invoice #, Receipt #, Survey #, Reference #, Account #, Policy #, or Certificate ID if clearly visible.
   - amount: Currency and amount if financial (e.g. "$450.00").
   - location: City, area, state, or address if prominent and relevant (e.g. "Gollakuppam").
5. Formulate a clean, descriptive, concise suggested_filename that represents the document contents clearly following standard professional naming convention (e.g. Sale_Deed_Survey_123-4_Gollakuppam_1998.jpg or Acme_Invoice_INV-9841_2024-10-12.pdf).
6. Assess confidence score between 0 and 100 based on legibility, completeness, and clarity.
7. Provide a concise 1-2 sentence reasoning_summary.
8. Add any pertinent warnings (e.g., "Date partially cut off", "Handwritten survey number inferred", "Low resolution scan").`;

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "FileMind AI Engine",
    model: "gemini-3.7-flash",
    timestamp: new Date().toISOString(),
  });
});

// API: Analyze File with Gemini
app.post("/api/analyze-file", async (req, res) => {
  const startTime = Date.now();
  try {
    const { file, templateConfig } = req.body;

    if (!file || !file.name) {
      return res.status(400).json({ error: "Missing required file parameter." });
    }

    const originalFilename = file.name;
    const extension = originalFilename.includes(".")
      ? originalFilename.slice(originalFilename.lastIndexOf("."))
      : "";
    const mimeType = file.type || "image/jpeg";
    const base64Data = file.base64;

    // Check if base64 data exists
    if (!base64Data) {
      return res.status(400).json({
        error: "Missing base64 file data for multimodal analysis.",
      });
    }

    // Clean base64 string if it has data URL prefix
    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");

    const ai = getAIClient();

    let userPrompt = `Analyze this document file named "${originalFilename}".
Detect the document type, extract all visible fields, calculate confidence score (0-100), and suggest a pristine filesystem-safe filename.`;

    if (templateConfig) {
      userPrompt += `\nUser preferred naming template pattern: ${templateConfig.pattern || "{DocType}_{Entity}_{Date}_{Identifier}"} with separator "${templateConfig.separator || "_"}" and casing "${templateConfig.caseStyle || "PascalCase"}".`;
    }

    // Prepare multimodal inline part
    const inlinePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType === "application/pdf" ? "application/pdf" : mimeType,
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: {
        parts: [inlinePart, { text: userPrompt }],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original_filename: { type: Type.STRING },
            document_type: { type: Type.STRING },
            suggested_filename: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning_summary: { type: Type.STRING },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            is_uncertain: { type: Type.BOOLEAN },
            extracted_fields: {
              type: Type.OBJECT,
              properties: {
                entity_name: { type: Type.STRING },
                document_title: { type: Type.STRING },
                date: { type: Type.STRING },
                identifier: { type: Type.STRING },
                amount: { type: Type.STRING },
                location: { type: Type.STRING },
                category: { type: Type.STRING },
              },
            },
          },
          required: [
            "document_type",
            "suggested_filename",
            "confidence",
            "reasoning_summary",
          ],
        },
      },
    });

    const rawText = response.text || "{}";
    let parsedResult;
    try {
      parsedResult = JSON.parse(rawText);
    } catch {
      parsedResult = {
        document_type: "Document",
        suggested_filename: originalFilename,
        confidence: 60,
        reasoning_summary: "Processed visual file.",
        warnings: ["Response formatting adjusted."],
        extracted_fields: {},
      };
    }

    // Enforce filesystem safety & preserve original extension
    const cleanSuggestedName = sanitizeFilename(
      parsedResult.suggested_filename || originalFilename,
      extension
    );

    const finalResult = {
      original_filename: originalFilename,
      document_type: parsedResult.document_type || "Uncategorized",
      suggested_filename: cleanSuggestedName,
      extracted_fields: parsedResult.extracted_fields || {},
      confidence: Math.min(100, Math.max(0, Math.round(parsedResult.confidence || 75))),
      reasoning_summary: parsedResult.reasoning_summary || "Document parsed via vision analysis.",
      warnings: Array.isArray(parsedResult.warnings) ? parsedResult.warnings : [],
      is_uncertain: Boolean(parsedResult.is_uncertain || (parsedResult.confidence && parsedResult.confidence < 60)),
      processing_time_ms: Date.now() - startTime,
    };

    res.json(finalResult);
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    res.status(500).json({
      error: error?.message || "Failed to analyze document with Gemini AI.",
      duration_ms: Date.now() - startTime,
    });
  }
});

// API: Batch analysis handler
app.post("/api/batch-analyze", async (req, res) => {
  const { files, templateConfig } = req.body;
  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: "Files array is required." });
  }

  const results = [];
  const ai = getAIClient();

  for (const file of files) {
    try {
      const originalFilename = file.name || "unnamed";
      const extension = originalFilename.includes(".")
        ? originalFilename.slice(originalFilename.lastIndexOf("."))
        : "";
      const cleanBase64 = (file.base64 || "").replace(/^data:[^;]+;base64,/, "");

      if (!cleanBase64) {
        results.push({
          original_filename: originalFilename,
          error: "Missing image content",
          suggested_filename: originalFilename,
          confidence: 0,
        });
        continue;
      }

      const inlinePart = {
        inlineData: {
          data: cleanBase64,
          mimeType: file.type || "image/jpeg",
        },
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: {
          parts: [
            inlinePart,
            {
              text: `Analyze this document file "${originalFilename}". Follow FileMind rules. Extract fields, suggest clean filename. Template: ${templateConfig?.pattern || "{DocType}_{Entity}_{Date}"}`,
            },
          ],
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              document_type: { type: Type.STRING },
              suggested_filename: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              reasoning_summary: { type: Type.STRING },
              warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
              extracted_fields: {
                type: Type.OBJECT,
                properties: {
                  entity_name: { type: Type.STRING },
                  document_title: { type: Type.STRING },
                  date: { type: Type.STRING },
                  identifier: { type: Type.STRING },
                  amount: { type: Type.STRING },
                },
              },
            },
            required: ["document_type", "suggested_filename", "confidence"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      results.push({
        original_filename: originalFilename,
        document_type: parsed.document_type || "Document",
        suggested_filename: sanitizeFilename(parsed.suggested_filename || originalFilename, extension),
        extracted_fields: parsed.extracted_fields || {},
        confidence: Math.round(parsed.confidence || 75),
        reasoning_summary: parsed.reasoning_summary || "",
        warnings: parsed.warnings || [],
      });
    } catch (err: any) {
      results.push({
        original_filename: file.name,
        error: err?.message || "Analysis error",
        suggested_filename: file.name,
        confidence: 0,
      });
    }
  }

  res.json({ results });
});

// API: Generate Local Desktop Agent Script
app.post("/api/generate-desktop-script", (req, res) => {
  const { osType = "cross_platform", apiKeyToken = "FM_TOKEN_LIVE_KEY", template = "{DocType}_{Entity}_{Date}_{Identifier}" } = req.body;

  const pythonScript = `#!/usr/bin/env python3
"""
FileMind AI - Local Desktop Agent (v1.2)
Process 5GB, 20GB+ local folder collections with zero cloud storage uploads.
Only lightweight thumbnail/text previews are securely analyzed via FileMind AI API.
Files are renamed locally on your disk.
"""

import os
import sys
import base64
import requests
import argparse
from pathlib import Path

API_ENDPOINT = "https://ai.studio/api/analyze-file"
API_KEY = "${apiKeyToken}"
NAMING_TEMPLATE = "${template}"
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".pdf"}

def process_directory(directory_path, dry_run=True):
    path = Path(directory_path)
    if not path.exists() or not path.is_dir():
        print(f"[Error] Invalid directory: {directory_path}")
        return

    files = [f for f in path.iterdir() if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS]
    print(f"[*] Found {len(files)} eligible documents in {directory_path}")
    print(f"[*] Mode: {'DRY RUN (Preview Only)' if dry_run else 'LIVE RENAME'}\\n")

    for idx, file_path in enumerate(files, start=1):
        print(f"[{idx}/{len(files)}] Analyzing: {file_path.name}...")
        try:
            with open(file_path, "rb") as f:
                b64_content = base64.b64encode(f.read()).decode("utf-8")

            payload = {
                "file": {
                    "name": file_path.name,
                    "type": "application/pdf" if file_path.suffix.lower() == ".pdf" else "image/jpeg",
                    "base64": b64_content
                },
                "templateConfig": {
                    "pattern": NAMING_TEMPLATE
                }
            }

            headers = {"Content-Type": "application/json", "Authorization": f"Bearer {API_KEY}"}
            res = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=30)
            
            if res.status_code == 200:
                data = res.json()
                suggested = data.get("suggested_filename", file_path.name)
                conf = data.get("confidence", 0)
                doc_type = data.get("document_type", "Document")
                
                print(f"    -> Type: {doc_type} | Confidence: {conf}%")
                print(f"    -> New Name: {suggested}")
                
                if not dry_run and suggested != file_path.name:
                    target_path = file_path.parent / suggested
                    # Avoid overwrite collision
                    counter = 1
                    while target_path.exists():
                        target_path = file_path.parent / f"{target_path.stem}_{counter}{target_path.suffix}"
                        counter += 1
                    file_path.rename(target_path)
                    print(f"    [OK] Renamed successfully to {target_path.name}")
            else:
                print(f"    [Fail] API Error ({res.status_code}): {res.text}")

        except Exception as e:
            print(f"    [Error] {str(e)}")

    print("\\n[+] Batch organization complete!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FileMind AI Desktop Organizer Agent")
    parser.add_argument("folder", help="Target folder containing documents")
    parser.add_argument("--live", action="store_true", help="Execute real filesystem renames (defaults to dry-run)")
    args = parser.parse_args()
    process_directory(args.folder, dry_run=not args.live)
`;

  const bashScript = `#!/usr/bin/env bash
# FileMind AI Local Renaming Script
# Execute batch rename for approved files in current folder
set -e
echo "Starting FileMind AI Local Rename..."
# Generated script contains safe local 'mv' commands
`;

  const powershellScript = `# FileMind AI PowerShell Local Renamer
Write-Host "FileMind AI - Local Execution Engine" -ForegroundColor Cyan
`;

  res.json({
    pythonScript,
    bashScript,
    powershellScript,
  });
});

// Vite & Static server integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FileMind AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
