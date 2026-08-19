import React, { useState } from "react";
import {
  X,
  UserCheck,
  Zap,
  ArrowRight
} from "lucide-react";
import { AuthUser } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState("raj.asusrog@gmail.com");
  const [displayName, setDisplayName] = useState("Rajesh K");

  const handleDemoSignIn = (plan: "Free" | "Pro" | "Enterprise" = "Pro") => {
    onLogin({
      uid: "usr_demo_89104",
      email: "raj.asusrog@gmail.com",
      displayName: "Rajesh K",
      plan,
      apiKey: "fma_live_98a72b109e44f8",
      isAnonymous: false,
    });
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      uid: `usr_${Date.now()}`,
      email: email || "user@filemind.ai",
      displayName: displayName || email.split("@")[0],
      plan: "Pro",
      apiKey: `fma_live_${Math.random().toString(36).substring(2, 12)}`,
      isAnonymous: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                FileMind Account
              </h3>
              <p className="text-[10px] text-[#888]">
                Sign in to sync naming rules &amp; tokens
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#888] hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Demo Accounts */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#888] block">
            Instant Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="demo-pro-btn"
              onClick={() => handleDemoSignIn("Pro")}
              className="p-2.5 rounded-lg bg-[#161616] hover:bg-[#222] border border-indigo-500/50 text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Pro Plan
                </span>
                <Zap className="w-3 h-3 text-indigo-400" />
              </div>
              <p className="text-[10px] text-[#888] mt-0.5">
                5,000 files + CLI
              </p>
            </button>

            <button
              type="button"
              id="demo-free-btn"
              onClick={() => handleDemoSignIn("Free")}
              className="p-2.5 rounded-lg bg-[#161616] hover:bg-[#222] border border-[#2a2a2a] text-left transition-colors"
            >
              <span className="text-xs font-bold text-[#ccc]">
                Free Starter
              </span>
              <p className="text-[10px] text-[#888] mt-0.5">
                100 files quota
              </p>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#2a2a2a] w-full" />
          <span className="bg-[#0f0f0f] px-2 text-[10px] text-[#666] uppercase tracking-wider">
            Or credentials
          </span>
        </div>

        {/* Custom Auth Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-2.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
              Full Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full text-xs bg-[#161616] border border-[#333] rounded px-3 py-1.5 text-[#e5e5e5] focus:outline-none focus:border-indigo-500"
              placeholder="Rajesh K"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs bg-[#161616] border border-[#333] rounded px-3 py-1.5 text-[#e5e5e5] focus:outline-none focus:border-indigo-500"
              placeholder="raj.asusrog@gmail.com"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm flex items-center justify-center space-x-1.5"
          >
            <span>Continue to Workspace</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
