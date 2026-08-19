import JSZip from "jszip";
import { CaseStyle, DateFormatStyle, FileItem, NamingTemplate, SeparatorStyle } from "../types";

// Generate unique ID
export function generateId(): string {
  return `f_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Get file extension with dot
export function getFileExtension(filename: string): string {
  if (!filename) return "";
  const lastDot = filename.lastIndexOf(".");
  return lastDot !== -1 ? filename.substring(lastDot) : "";
}

// Sanitize filename for filesystem safety
export function getSanitizedFilename(name: string, ext?: string): string {
  if (!name) return "Document";
  let cleaned = name.replace(/[/\\?%*:|"<>]/g, "_").trim();
  // Ensure single dot extension
  if (ext) {
    const cleanExt = ext.startsWith(".") ? ext : `.${ext}`;
    if (!cleaned.toLowerCase().endsWith(cleanExt.toLowerCase())) {
      cleaned = `${cleaned}${cleanExt}`;
    }
  }
  return cleaned;
}

// Convert user file or blob to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// Convert SVG data URL to PNG Base64 via Canvas so Gemini multimodal receives standard image format
export function svgDataUrlToPngBase64(svgDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || 600;
      canvas.height = img.naturalHeight || 800;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      } else {
        resolve(svgDataUrl);
      }
    };
    img.onerror = () => resolve(svgDataUrl);
    img.src = svgDataUrl;
  });
}

// Format casing according to template
export function applyCaseStyle(text: string, caseStyle: CaseStyle): string {
  if (!text) return "";
  const words = text
    .replace(/[^\w\s-]/g, "")
    .trim()
    .split(/[\s_-]+/);

  switch (caseStyle) {
    case "PascalCase":
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("");
    case "camelCase":
      return words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join("");
    case "snake_case":
      return words.map((w) => w.toLowerCase()).join("_");
    case "kebab-case":
      return words.map((w) => w.toLowerCase()).join("-");
    case "UPPER_CASE":
      return words.map((w) => w.toUpperCase()).join("_");
    default:
      return text;
  }
}

// Format date string
export function formatDateByStyle(
  dateStr: string | undefined,
  style: DateFormatStyle
): string {
  if (!dateStr) return "";
  const cleaned = dateStr.trim();

  // Try parsing date
  const parsed = new Date(cleaned);
  const isValid = !isNaN(parsed.getTime());

  if (!isValid) {
    // If it's just a year like 1998, return it
    if (/^\d{4}$/.test(cleaned)) return cleaned;
    return cleaned.replace(/[/\\?%*:|"<>]/g, "-");
  }

  const yyyy = parsed.getFullYear();
  const mm = String(parsed.getMonth() + 1).padStart(2, "0");
  const dd = String(parsed.getDate()).padStart(2, "0");

  switch (style) {
    case "YYYY-MM-DD":
      return `${yyyy}-${mm}-${dd}`;
    case "YYYYMMDD":
      return `${yyyy}${mm}${dd}`;
    case "YYYY_MM":
      return `${yyyy}_${mm}`;
    case "DD-MM-YYYY":
      return `${dd}-${mm}-${yyyy}`;
    case "YYYY":
      return `${yyyy}`;
    default:
      return `${yyyy}-${mm}-${dd}`;
  }
}

// Apply template to extracted fields
export function applyTemplateToFields(
  template: NamingTemplate,
  extracted: Record<string, string | undefined>,
  originalExt: string
): string {
  return buildFilenameFromTemplate(template, extracted, originalExt);
}

// Apply naming template to extracted fields
export function buildFilenameFromTemplate(
  template: NamingTemplate,
  extracted: {
    document_type?: string;
    entity_name?: string;
    date?: string;
    identifier?: string;
    location?: string;
    [key: string]: string | undefined;
  },
  originalExt: string
): string {
  const separator = template.separator || "_";
  const caseStyle = template.caseStyle || "PascalCase";

  const docType = extracted.document_type ? applyCaseStyle(extracted.document_type, caseStyle) : "";
  const entity = extracted.entity_name ? applyCaseStyle(extracted.entity_name, caseStyle) : "";
  const date = formatDateByStyle(extracted.date, template.dateFormat || "YYYY-MM-DD");
  const identifier = extracted.identifier
    ? extracted.identifier.replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "-")
    : "";
  const location = extracted.location ? applyCaseStyle(extracted.location, caseStyle) : "";

  let result = template.pattern
    .replace("{DocType}", docType)
    .replace("{Entity}", entity)
    .replace("{Date}", date)
    .replace("{Identifier}", identifier)
    .replace("{Location}", location);

  // Clean up consecutive separators
  const sepEscaped = separator === "." ? "\\." : separator;
  result = result
    .replace(new RegExp(`[${sepEscaped}]{2,}`, "g"), separator)
    .replace(new RegExp(`^[${sepEscaped}]+|[${sepEscaped}]+$`, "g"), "");

  // Fallback if blank
  if (!result.trim()) {
    result = docType || "Document";
  }

  // Ensure filesystem safe
  result = result.replace(/[/\\?%*:|"<>]/g, "_");

  const ext = originalExt ? (originalExt.startsWith(".") ? originalExt : `.${originalExt}`) : "";
  return `${result}${ext}`;
}

// Detect and resolve filename collisions in the current batch
export function resolveBatchCollisions(items: FileItem[]): FileItem[] {
  const seen = new Map<string, number>();

  return items.map((item) => {
    const filename = item.editedFilename || item.suggestedFilename || item.name;
    const dotIdx = filename.lastIndexOf(".");
    const base = dotIdx !== -1 ? filename.substring(0, dotIdx) : filename;
    const ext = dotIdx !== -1 ? filename.substring(dotIdx) : "";

    const count = seen.get(filename) || 0;
    seen.set(filename, count + 1);

    if (count > 0) {
      const collisionName = `${base}_${count}${ext}`;
      return {
        ...item,
        suggestedFilename: collisionName,
        editedFilename: item.editedFilename ? collisionName : undefined,
      };
    }
    return item;
  });
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Generate ZIP of approved renamed files
export async function downloadRenamedZip(files: FileItem[]): Promise<void> {
  const zip = new JSZip();
  const approvedFiles = files.filter(
    (f) => f.status === "approved" || f.status === "completed"
  );

  if (approvedFiles.length === 0) return;

  for (const item of approvedFiles) {
    const filename = item.approvedFilename || item.editedFilename || item.suggestedFilename || item.name;

    if (item.file) {
      zip.file(filename, item.file);
    } else if (item.previewUrl && item.previewUrl.startsWith("data:")) {
      // Decode base64 preview
      const base64Data = item.previewUrl.split(",")[1];
      zip.file(filename, base64Data, { base64: true });
    } else {
      // Placeholder content if file content wasn't stored
      zip.file(filename, `FileMind AI Organized Document: ${item.originalFilename}`);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = `FileMind_Organized_${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate bash / powershell rename commands
export function generateLocalRenameScript(
  files: FileItem[],
  type: "bash" | "powershell" | "python"
): string {
  const approvedFiles = files.filter(
    (f) => (f.status === "approved" || f.status === "completed") && f.suggestedFilename !== f.originalFilename
  );

  if (type === "bash") {
    let script = `#!/usr/bin/env bash\n# FileMind AI Local Renaming Script\n# Run inside the target directory containing your files\n\n`;
    approvedFiles.forEach((f) => {
      const from = f.originalFilename.replace(/"/g, '\\"');
      const to = (f.approvedFilename || f.editedFilename || f.suggestedFilename || f.originalFilename).replace(/"/g, '\\"');
      script += `if [ -f "${from}" ]; then\n  mv -n "${from}" "${to}"\n  echo "Renamed: ${from} -> ${to}"\nfi\n\n`;
    });
    return script;
  }

  if (type === "powershell") {
    let script = `# FileMind AI PowerShell Local Renamer\n# Run inside target folder\n\n`;
    approvedFiles.forEach((f) => {
      const from = f.originalFilename.replace(/'/g, "''");
      const to = (f.approvedFilename || f.editedFilename || f.suggestedFilename || f.originalFilename).replace(/'/g, "''");
      script += `if (Test-Path -Path '${from}') {\n  Rename-Item -Path '${from}' -NewName '${to}'\n  Write-Host "Renamed: ${from} -> ${to}" -ForegroundColor Green\n}\n\n`;
    });
    return script;
  }

  // Python
  let script = `#!/usr/bin/env python3\nimport os\nfrom pathlib import Path\n\nrenames = [\n`;
  approvedFiles.forEach((f) => {
    const from = f.originalFilename;
    const to = f.approvedFilename || f.editedFilename || f.suggestedFilename || f.originalFilename;
    script += `    ("${from}", "${to}"),\n`;
  });
  script += `]\n\nfor old_name, new_name in renames:\n    p = Path(old_name)\n    if p.exists():\n        target = Path(new_name)\n        if not target.exists():\n            p.rename(target)\n            print(f"Renamed: {old_name} -> {new_name}")\n        else:\n            print(f"Skipped {old_name}: {new_name} already exists.")\n`;
  return script;
}
