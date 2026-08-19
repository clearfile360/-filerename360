import React, { useState } from "react";
import {
  Sliders,
  Sparkles,
  Plus,
  Check,
  Save
} from "lucide-react";
import { CaseStyle, DateFormatStyle, NamingTemplate, SeparatorStyle } from "../types";
import { buildFilenameFromTemplate } from "../utils/fileUtils";

interface NamingTemplatesViewProps {
  templates: NamingTemplate[];
  activeTemplateId: string;
  onSelectTemplate: (id: string) => void;
  onSaveTemplate: (template: NamingTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export const NamingTemplatesView: React.FC<NamingTemplatesViewProps> = ({
  templates,
  activeTemplateId,
  onSelectTemplate,
  onSaveTemplate,
}) => {
  const activeTemplate =
    templates.find((t) => t.id === activeTemplateId) || templates[0];

  const [pattern, setPattern] = useState(activeTemplate?.pattern || "{DocType}_{Entity}_{Date}_{Identifier}");
  const [separator, setSeparator] = useState<SeparatorStyle>(activeTemplate?.separator || "_");
  const [caseStyle, setCaseStyle] = useState<CaseStyle>(activeTemplate?.caseStyle || "PascalCase");
  const [dateFormat, setDateFormat] = useState<DateFormatStyle>(activeTemplate?.dateFormat || "YYYY-MM-DD");
  const [templateName, setTemplateName] = useState(activeTemplate?.name || "Custom Rule");
  const [templateDesc, setTemplateDesc] = useState(activeTemplate?.description || "User defined naming configuration");
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Sync state when active template changes
  React.useEffect(() => {
    if (activeTemplate) {
      setPattern(activeTemplate.pattern);
      setSeparator(activeTemplate.separator);
      setCaseStyle(activeTemplate.caseStyle);
      setDateFormat(activeTemplate.dateFormat);
      setTemplateName(activeTemplate.name);
      setTemplateDesc(activeTemplate.description);
    }
  }, [activeTemplateId]);

  const insertToken = (token: string) => {
    setPattern((prev) => {
      if (prev.endsWith(separator)) {
        return prev + token;
      }
      return prev ? `${prev}${separator}${token}` : token;
    });
  };

  const handleSaveCurrent = () => {
    const updated: NamingTemplate = {
      id: activeTemplate.id.startsWith("tpl_custom_") ? activeTemplate.id : `tpl_custom_${Date.now()}`,
      name: templateName,
      description: templateDesc,
      pattern,
      separator,
      caseStyle,
      dateFormat,
      isDefault: false,
    };
    onSaveTemplate(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const testCases = [
    {
      title: "Property Sale Deed (1998)",
      docType: "Sale Deed",
      entity: "Gollakuppam Registration",
      date: "1998-11-14",
      identifier: "Survey-123-4",
      location: "Gollakuppam",
      ext: ".jpg",
    },
    {
      title: "Acme SaaS Invoice",
      docType: "Invoice",
      entity: "Acme Cloud Inc",
      date: "2024-10-15",
      identifier: "INV-9841",
      location: "San Francisco",
      ext: ".pdf",
    },
    {
      title: "BioHealth Clinical Pathology Lab",
      docType: "Medical Report",
      entity: "BioHealth Diagnostics",
      date: "2024-11-04",
      identifier: "BLD-4019",
      location: "Seattle",
      ext: ".png",
    },
  ];

  const currentConfig: NamingTemplate = {
    id: "preview_temp",
    name: templateName,
    description: templateDesc,
    pattern,
    separator,
    caseStyle,
    dateFormat,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f0f0f] border border-[#2a2a2a] p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Naming Rules &amp; Template Configuration
            </h2>
          </div>
          <p className="text-xs text-[#888] mt-1 max-w-2xl">
            Configure how extracted metadata (Document Type, Organization, Dates, Survey/Invoice Numbers) compiles into standardized filenames.
          </p>
        </div>

        <button
          id="create-new-template-btn"
          type="button"
          onClick={() => {
            const newTpl: NamingTemplate = {
              id: `tpl_custom_${Date.now()}`,
              name: `Custom Template ${templates.length + 1}`,
              description: "Custom organizational structure",
              pattern: "{DocType}_{Entity}_{Date}",
              separator: "_",
              caseStyle: "PascalCase",
              dateFormat: "YYYY-MM-DD",
            };
            onSaveTemplate(newTpl);
            onSelectTemplate(newTpl.id);
          }}
          className="px-3.5 py-1.5 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Custom Template</span>
        </button>
      </div>

      {/* Main Grid: Left Template Presets / Right Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Template Catalog */}
        <div className="space-y-2.5">
          <h3 className="text-[10px] font-bold text-[#888] uppercase tracking-widest px-1">
            Available Templates
          </h3>

          <div className="space-y-2">
            {templates.map((tpl) => {
              const isSelected = tpl.id === activeTemplateId;
              return (
                <div
                  key={tpl.id}
                  onClick={() => onSelectTemplate(tpl.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#161616] border-indigo-500 shadow-sm"
                      : "bg-[#0f0f0f] border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#141414]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white flex items-center space-x-1.5">
                        <span>{tpl.name}</span>
                        {tpl.isDefault && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase font-bold">
                            Default
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-[#777] mt-0.5">
                        {tpl.description}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-[#222] font-mono text-[10px] text-indigo-300 truncate">
                    {tpl.pattern}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Template Configuration & Live Tester */}
        <div className="lg:col-span-2 space-y-5">
          {/* Builder Card */}
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
              <div>
                <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest">
                  Rule Definition
                </h3>
                <p className="text-xs text-white font-medium mt-0.5">
                  {templateName}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  id="save-template-btn"
                  onClick={handleSaveCurrent}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm flex items-center space-x-1.5"
                >
                  <Save className="w-3 h-3" />
                  <span>{isSavedNotice ? "Saved!" : "Save Rule"}</span>
                </button>
              </div>
            </div>

            {/* Pattern Input & Token Buttons */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#888] block">
                Pattern String
              </label>

              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="{DocType}_{Entity}_{Date}_{Identifier}"
                className="w-full text-xs font-mono bg-[#161616] border border-[#333] rounded px-3 py-2 text-indigo-300 focus:outline-none focus:border-indigo-500"
              />

              {/* Token insertion pills */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="text-[10px] text-[#666] font-bold uppercase mr-1">Insert:</span>
                {[
                  { token: "{DocType}" },
                  { token: "{Entity}" },
                  { token: "{Date}" },
                  { token: "{Identifier}" },
                  { token: "{Location}" },
                ].map((t) => (
                  <button
                    key={t.token}
                    type="button"
                    onClick={() => insertToken(t.token)}
                    className="px-2 py-0.5 text-[10px] rounded bg-[#161616] hover:bg-[#222] text-[#ccc] border border-[#2a2a2a] transition-colors font-mono"
                  >
                    + {t.token}
                  </button>
                ))}
              </div>
            </div>

            {/* Form controls: Separator, Case Style, Date Format */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Separator */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                  Separator
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { val: "_" },
                    { val: "-" },
                    { val: "." },
                    { val: " " },
                  ].map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => setSeparator(s.val as SeparatorStyle)}
                      className={`py-1.5 text-xs font-mono font-semibold rounded border text-center transition-colors ${
                        separator === s.val
                          ? "bg-indigo-600/30 text-indigo-300 border-indigo-500"
                          : "bg-[#161616] text-[#888] border-[#2a2a2a] hover:border-[#3a3a3a]"
                      }`}
                    >
                      {s.val === " " ? "SPC" : s.val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Case Style */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                  Casing Style
                </label>
                <select
                  value={caseStyle}
                  onChange={(e) => setCaseStyle(e.target.value as CaseStyle)}
                  className="w-full text-xs bg-[#161616] border border-[#333] rounded px-2.5 py-1.5 text-[#e5e5e5] focus:outline-none focus:border-indigo-500"
                >
                  <option value="PascalCase">PascalCase (SaleDeed)</option>
                  <option value="snake_case">snake_case (sale_deed)</option>
                  <option value="kebab-case">kebab-case (sale-deed)</option>
                  <option value="camelCase">camelCase (saleDeed)</option>
                  <option value="UPPER_CASE">UPPER_CASE (SALE_DEED)</option>
                </select>
              </div>

              {/* Date Format */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                  Date Format
                </label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value as DateFormatStyle)}
                  className="w-full text-xs bg-[#161616] border border-[#333] rounded px-2.5 py-1.5 text-[#e5e5e5] focus:outline-none focus:border-indigo-500"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2024-10-15)</option>
                  <option value="YYYYMMDD">YYYYMMDD (20241015)</option>
                  <option value="YYYY_MM">YYYY_MM (2024_10)</option>
                  <option value="DD-MM-YYYY">DD-MM-YYYY (15-10-2024)</option>
                </select>
              </div>
            </div>

            {/* Template Name & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#2a2a2a]">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                  Template Label
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full text-xs bg-[#161616] border border-[#333] rounded px-2.5 py-1.5 text-[#e5e5e5] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                  Description
                </label>
                <input
                  type="text"
                  value={templateDesc}
                  onChange={(e) => setTemplateDesc(e.target.value)}
                  className="w-full text-xs bg-[#161616] border border-[#333] rounded px-2.5 py-1.5 text-[#e5e5e5] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Real-time Live Output Preview on Sample Documents */}
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest">
                Live Output Preview
              </h3>
            </div>

            <div className="space-y-2">
              {testCases.map((tc, idx) => {
                const generated = buildFilenameFromTemplate(
                  currentConfig,
                  {
                    document_type: tc.docType,
                    entity_name: tc.entity,
                    date: tc.date,
                    identifier: tc.identifier,
                    location: tc.location,
                  },
                  tc.ext
                );

                return (
                  <div
                    key={idx}
                    className="p-3 bg-[#0d0d0d] rounded-lg border border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-medium text-[#e5e5e5]">
                        {tc.title}
                      </span>
                      <div className="flex items-center space-x-2 text-[10px] text-[#666] mt-0.5">
                        <span>{tc.docType}</span>
                        <span>•</span>
                        <span>{tc.date}</span>
                        <span>•</span>
                        <span className="font-mono">{tc.identifier}</span>
                      </div>
                    </div>

                    <div className="font-mono text-xs text-indigo-300 bg-[#161616] px-3 py-1.5 rounded border border-[#2a2a2a] font-medium truncate max-w-md">
                      {generated}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
