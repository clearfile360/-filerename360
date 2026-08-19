import React from "react";
import {
  FolderSync,
  Sparkles,
  LayoutDashboard,
  Sliders,
  History,
  Terminal,
  CreditCard,
  UserCheck,
  LogOut,
  Layers,
  CheckCircle2,
  HardDrive
} from "lucide-react";
import { AuthUser } from "../types";

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  authUser: AuthUser;
  onOpenAuth: () => void;
  totalFiles?: number;
  analyzedCount?: number;
  reviewCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  authUser,
  onOpenAuth,
  totalFiles = 0,
  analyzedCount = 14,
  reviewCount = 2,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0f0f0f] border-b border-[#2a2a2a] text-[#e5e5e5] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand & Left Section */}
          <div className="flex items-center space-x-5">
            <button
              id="brand-logo-btn"
              onClick={() => onSelectTab("dashboard")}
              className="flex items-center space-x-2.5 focus:outline-none group text-left"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-base shadow-sm group-hover:bg-indigo-500 transition-colors">
                F
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm tracking-tight text-white font-sans">
                  FileMind AI
                </span>
                <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] rounded border border-indigo-500/20 font-bold uppercase tracking-wider">
                  High Density
                </span>
              </div>
            </button>

            {/* Main Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-[#2a2a2a]">
              <button
                id="nav-tab-dashboard"
                onClick={() => onSelectTab("dashboard")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                  activeTab === "dashboard"
                    ? "bg-[#1c1c1c] text-indigo-400 font-semibold border border-[#333]"
                    : "text-[#888] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Workspace</span>
              </button>

              <button
                id="nav-tab-templates"
                onClick={() => onSelectTab("templates")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                  activeTab === "templates"
                    ? "bg-[#1c1c1c] text-indigo-400 font-semibold border border-[#333]"
                    : "text-[#888] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Naming Rules</span>
              </button>

              <button
                id="nav-tab-history"
                onClick={() => onSelectTab("history")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                  activeTab === "history"
                    ? "bg-[#1c1c1c] text-indigo-400 font-semibold border border-[#333]"
                    : "text-[#888] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Audit Log</span>
              </button>

              <button
                id="nav-tab-agent"
                onClick={() => onSelectTab("agent")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                  activeTab === "agent"
                    ? "bg-[#1c1c1c] text-indigo-400 font-semibold border border-[#333]"
                    : "text-[#888] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Desktop Agent</span>
                <span className="text-[9px] px-1 py-0.2 bg-indigo-950 text-indigo-300 border border-indigo-800/80 rounded font-mono">
                  CLI
                </span>
              </button>

              <button
                id="nav-tab-billing"
                onClick={() => onSelectTab("billing")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                  activeTab === "billing"
                    ? "bg-[#1c1c1c] text-indigo-400 font-semibold border border-[#333]"
                    : "text-[#888] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Plans &amp; Usage</span>
              </button>

              <button
                id="nav-tab-landing"
                onClick={() => onSelectTab("landing")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                  activeTab === "landing"
                    ? "bg-[#1c1c1c] text-indigo-400 font-semibold border border-[#333]"
                    : "text-[#888] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>
            </nav>
          </div>

          {/* Right Metrics & Auth Section */}
          <div className="flex items-center space-x-4">
            {/* Header Telemetry stats */}
            <div className="hidden sm:flex items-center gap-4 text-xs font-medium border-r border-[#2a2a2a] pr-4">
              <div className="flex flex-col items-end">
                <span className="text-[#888] uppercase tracking-wider text-[9px] font-semibold">
                  Analyzed
                </span>
                <span className="text-white font-mono text-xs">{analyzedCount}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[#888] uppercase tracking-wider text-[9px] font-semibold">
                  Review Required
                </span>
                <span className="text-yellow-500 font-mono text-xs font-bold">{reviewCount}</span>
              </div>
            </div>

            {/* User Account / Auth */}
            {authUser ? (
              <div className="flex items-center space-x-2">
                <div
                  onClick={onOpenAuth}
                  className="flex items-center space-x-2 text-xs cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1c1c1c] border border-[#333] flex items-center justify-center text-[#e5e5e5] font-semibold text-xs">
                    {authUser.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-medium text-white leading-tight">
                      {authUser.displayName}
                    </p>
                    <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                      {authUser.plan} Tier
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                id="open-auth-btn"
                onClick={onOpenAuth}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center space-x-1"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Subnavigation Strip */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-1.5 border-t border-[#2a2a2a] space-x-1 text-xs">
          <button
            onClick={() => onSelectTab("dashboard")}
            className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap ${
              activeTab === "dashboard" ? "bg-[#1c1c1c] text-indigo-400 font-bold border border-[#333]" : "text-[#888]"
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => onSelectTab("templates")}
            className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap ${
              activeTab === "templates" ? "bg-[#1c1c1c] text-indigo-400 font-bold border border-[#333]" : "text-[#888]"
            }`}
          >
            Rules
          </button>
          <button
            onClick={() => onSelectTab("history")}
            className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap ${
              activeTab === "history" ? "bg-[#1c1c1c] text-indigo-400 font-bold border border-[#333]" : "text-[#888]"
            }`}
          >
            Audit Log
          </button>
          <button
            onClick={() => onSelectTab("agent")}
            className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap ${
              activeTab === "agent" ? "bg-[#1c1c1c] text-indigo-400 font-bold border border-[#333]" : "text-[#888]"
            }`}
          >
            Agent CLI
          </button>
          <button
            onClick={() => onSelectTab("billing")}
            className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap ${
              activeTab === "billing" ? "bg-[#1c1c1c] text-indigo-400 font-bold border border-[#333]" : "text-[#888]"
            }`}
          >
            Plans
          </button>
        </div>
      </div>
    </header>
  );
};
