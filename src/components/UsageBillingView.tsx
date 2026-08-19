import React, { useState } from "react";
import {
  CreditCard,
  Check,
  Zap,
  Key,
  Copy,
  CheckCheck
} from "lucide-react";
import { AuthUser, UserStats } from "../types";

interface UsageBillingViewProps {
  authUser: AuthUser;
  stats: UserStats;
  onUpgradePlan: (plan: "Free" | "Pro" | "Enterprise") => void;
}

export const UsageBillingView: React.FC<UsageBillingViewProps> = ({
  authUser,
  stats,
  onUpgradePlan,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(authUser.apiKey || "fma_live_98a72b109e44f8");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const usagePercent = Math.min(
    100,
    Math.round((stats.quotaUsed / stats.quotaTotal) * 100)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Subscription &amp; Usage Quota
              </h2>
            </div>
            <p className="text-xs text-[#888] mt-0.5">
              Active Tier:{" "}
              <strong className="text-indigo-400 uppercase tracking-wider">
                {authUser.plan} Tier
              </strong>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-[#666] uppercase font-bold tracking-wider">Billing Cycle:</span>
            <p className="text-xs font-mono font-semibold text-[#ccc]">
              Auto-renews monthly
            </p>
          </div>
        </div>

        {/* Quota Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#222] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#888] text-[11px] font-medium">
              Monthly Document Quota
            </span>
            <span className="text-white font-mono text-xs font-semibold">
              {stats.quotaUsed.toLocaleString()} / {stats.quotaTotal.toLocaleString()} ({usagePercent}%)
            </span>
          </div>

          <div className="w-full h-2 bg-[#161616] rounded-full overflow-hidden border border-[#2a2a2a]">
            <div
              className={`h-full transition-all duration-300 ${
                usagePercent > 90
                  ? "bg-red-500"
                  : usagePercent > 70
                  ? "bg-yellow-500"
                  : "bg-indigo-500"
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* API Key Management Box */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-5 space-y-3">
        <div className="flex items-center space-x-2">
          <Key className="w-3.5 h-3.5 text-indigo-400" />
          <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest">
            Desktop Agent API Token
          </h3>
        </div>
        <p className="text-xs text-[#888]">
          Pass this token to your local CLI runner to authenticate 20GB+ desktop file analysis jobs without uploading files.
        </p>

        <div className="flex items-center space-x-2">
          <input
            type="password"
            readOnly
            value={authUser.apiKey || "fma_live_98a72b109e44f8"}
            className="flex-1 text-xs font-mono bg-[#161616] border border-[#333] rounded px-3 py-2 text-[#ccc] select-all"
          />
          <button
            type="button"
            onClick={handleCopyKey}
            className="px-3.5 py-2 text-xs font-semibold rounded bg-[#1c1c1c] hover:bg-[#262626] text-[#e5e5e5] border border-[#333] transition-colors flex items-center space-x-1.5"
          >
            {copiedKey ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Plan Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Free Starter */}
        <div
          className={`bg-[#0f0f0f] border rounded-xl p-5 space-y-4 relative flex flex-col justify-between ${
            authUser.plan === "Free"
              ? "border-indigo-500/80"
              : "border-[#2a2a2a]"
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Free Starter</h4>
              {authUser.plan === "Free" && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-[#777]">
              For basic document organizing on small batches.
            </p>

            <div className="pt-1 font-mono">
              <span className="text-2xl font-bold text-white">$0</span>
              <span className="text-xs text-[#666]"> / month</span>
            </div>

            <ul className="space-y-1.5 text-xs text-[#aaa] pt-2 border-t border-[#222]">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>100 docs / month</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>Multimodal vision analyzer</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>Standard templates</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            disabled={authUser.plan === "Free"}
            onClick={() => onUpgradePlan("Free")}
            className="w-full py-2 text-xs font-semibold rounded bg-[#1c1c1c] hover:bg-[#262626] text-[#888] border border-[#333] transition-colors disabled:opacity-50"
          >
            {authUser.plan === "Free" ? "Current Tier" : "Select Free"}
          </button>
        </div>

        {/* Pro Plan (Highlighted) */}
        <div
          className={`bg-[#0f0f0f] border rounded-xl p-5 space-y-4 relative flex flex-col justify-between shadow-lg ${
            authUser.plan === "Pro"
              ? "border-indigo-500 ring-1 ring-indigo-500/30"
              : "border-[#333] hover:border-indigo-500/50"
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Pro Organizer</h4>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-600 text-white">
                Popular
              </span>
            </div>
            <p className="text-xs text-[#777]">
              Power users &amp; high volume archiving.
            </p>

            <div className="pt-1 font-mono">
              <span className="text-2xl font-bold text-white">$19</span>
              <span className="text-xs text-[#666]"> / month</span>
            </div>

            <ul className="space-y-1.5 text-xs text-[#aaa] pt-2 border-t border-[#222]">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="font-semibold text-white">5,000 docs / month</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="text-indigo-300 font-medium">
                  Desktop CLI Agent (20GB+ local)
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>Unlimited custom templates</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>Bulk ZIP &amp; shell script generator</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onUpgradePlan("Pro")}
            className={`w-full py-2 text-xs font-semibold rounded transition-colors shadow-sm ${
              authUser.plan === "Pro"
                ? "bg-indigo-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            }`}
          >
            {authUser.plan === "Pro" ? "Current Tier" : "Upgrade to Pro"}
          </button>
        </div>

        {/* Enterprise Plan */}
        <div
          className={`bg-[#0f0f0f] border rounded-xl p-5 space-y-4 relative flex flex-col justify-between ${
            authUser.plan === "Enterprise"
              ? "border-indigo-500/80"
              : "border-[#2a2a2a]"
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Enterprise</h4>
              {authUser.plan === "Enterprise" && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-[#777]">
              Teams, law practices &amp; accounting offices.
            </p>

            <div className="pt-1 font-mono">
              <span className="text-2xl font-bold text-white">$79</span>
              <span className="text-xs text-[#666]"> / month</span>
            </div>

            <ul className="space-y-1.5 text-xs text-[#aaa] pt-2 border-t border-[#222]">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="font-semibold text-white">Unlimited docs</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>Dedicated Enterprise Agent</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>Team shared rules &amp; audit trails</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onUpgradePlan("Enterprise")}
            className="w-full py-2 text-xs font-semibold rounded bg-[#1c1c1c] hover:bg-[#262626] text-[#ccc] border border-[#333] transition-colors"
          >
            {authUser.plan === "Enterprise" ? "Current Tier" : "Upgrade to Enterprise"}
          </button>
        </div>
      </div>
    </div>
  );
};
