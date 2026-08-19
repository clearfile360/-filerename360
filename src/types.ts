export type DocumentType =
  | 'Invoice'
  | 'Receipt'
  | 'Sale Deed'
  | 'Contract'
  | 'Tax Document'
  | 'Medical Report'
  | 'ID / Passport'
  | 'Academic Certificate'
  | 'Utility Bill'
  | 'Bank Statement'
  | 'Employment Letter'
  | 'Insurance Policy'
  | 'Meeting Notes'
  | 'Photo / Graphic'
  | 'Uncategorized';

export interface ExtractedFields {
  entity_name?: string;
  document_title?: string;
  date?: string;
  identifier?: string;
  amount?: string;
  location?: string;
  category?: string;
  [key: string]: string | undefined;
}

export interface AIAnalysisResult {
  original_filename: string;
  document_type: DocumentType | string;
  suggested_filename: string;
  extracted_fields: ExtractedFields;
  confidence: number; // 0 - 100
  reasoning_summary: string;
  warnings: string[];
  is_uncertain?: boolean;
}

export type ProcessingStatus =
  | 'idle'
  | 'queued'
  | 'analyzing'
  | 'completed'
  | 'approved'
  | 'rejected'
  | 'error';

export interface FileItem {
  id: string;
  file?: File;
  name: string;
  originalFilename: string;
  extension: string;
  size: number;
  type?: string;
  mimeType?: string;
  previewUrl: string;
  base64?: string;
  status: ProcessingStatus;
  progress?: number;
  aiResult?: AIAnalysisResult;
  suggestedFilename?: string;
  editedFilename?: string;
  approvedFilename?: string;
  isEdited?: boolean;
  error?: string;
  timestamp?: number;
  uploadedAt?: number;
  processedAt?: number;
  processingDurationMs?: number;
  isSample?: boolean;
}

export type SeparatorStyle = '_' | '-' | '.' | ' ';
export type CaseStyle = 'PascalCase' | 'snake_case' | 'kebab-case' | 'camelCase' | 'UPPER_CASE';
export type DateFormatStyle = 'YYYY-MM-DD' | 'YYYYMMDD' | 'YYYY_MM' | 'DD-MM-YYYY' | 'YYYY';

export interface NamingTemplate {
  id: string;
  name: string;
  description: string;
  pattern: string; // e.g. "{DocType}_{Entity}_{Date}_{Identifier}"
  separator: SeparatorStyle;
  caseStyle: CaseStyle;
  dateFormat: DateFormatStyle;
  isDefault?: boolean;
  customPrefix?: string;
  customSuffix?: string;
}

export interface UserStats {
  filesAnalyzed: number;
  filesRequiringReview: number;
  filesRenamed: number;
  lowConfidenceCount: number;
  totalProcessingTimeMs: number;
  quotaUsed: number;
  quotaTotal: number;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  apiKey: string;
  isAnonymous: boolean;
}

export interface HistoryEntry {
  id: string;
  batchId?: string;
  timestamp: number;
  originalFilename: string;
  renamedFilename: string;
  documentType: string;
  confidence: number;
  status: 'Approved' | 'Rejected' | 'Manual Edit';
  fileSize?: number;
  templateUsed?: string;
}
