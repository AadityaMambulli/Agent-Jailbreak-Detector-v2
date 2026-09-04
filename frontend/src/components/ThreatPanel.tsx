import React from "react"
import { ShieldCheck, ShieldAlert, Shield, Radar } from "lucide-react"
import type { InspectResponse } from "@/lib/types"

interface Props {
  result: InspectResponse | null
  lastDuration: string | null
  loading: boolean
}

export const ThreatPanel: React.FC<Props> = ({
  result,
  lastDuration,
  loading,
}) => {
  const isBlocked = result?.status === "blocked"
  const isSafe = result?.status === "success"
  const confidencePct = result ? (result.confidence * 100).toFixed(1) : "0.0"

  return (
    <div
      className={`rounded-2xl border bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl transition-all duration-500 flex flex-col justify-between ${
        isBlocked
          ? "border-rose-500/40 shadow-rose-950/30"
          : isSafe
            ? "border-emerald-500/40 shadow-emerald-950/30"
            : "border-white/10"
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                isBlocked
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : isSafe
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-slate-800 border-white/10 text-slate-400"
              }`}
            >
              <Radar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Threat Analysis
              </h3>
              <p className="text-[11px] text-slate-400">
                Multi-layer inspection verdict
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-slate-300">
            {loading
              ? "evaluating..."
              : lastDuration
                ? `${lastDuration}ms`
                : "0.00ms"}
          </span>
        </div>

        {/* Big Status Badge */}
        <div
          className={`rounded-xl p-5 mb-5 border text-center transition-all duration-500 ${
            isBlocked
              ? "bg-rose-950/30 border-rose-500/30 text-rose-300"
              : isSafe
                ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                : "bg-black/40 border-white/10 text-slate-400"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
              isBlocked
                ? "bg-rose-500/20 text-rose-400"
                : isSafe
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-white/5 text-slate-500"
            }`}
          >
            {isBlocked ? (
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            ) : isSafe ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <Shield className="w-6 h-6" />
            )}
          </div>

          <div
            className={`text-lg font-bold tracking-tight ${
              isBlocked
                ? "text-rose-400"
                : isSafe
                  ? "text-emerald-400"
                  : "text-slate-300"
            }`}
          >
            {isBlocked
              ? "THREAT BLOCKED"
              : isSafe
                ? "PROMPT SAFE"
                : "Awaiting Interception"}
          </div>

          <div className="text-xs text-slate-400 mt-1">
            {isBlocked
              ? "Suppressed before financial agent invocation"
              : isSafe
                ? "Cleared all heuristic & ML security layers"
                : "Select a demo scenario or enter a prompt"}
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Confidence Score</span>
            <span className="font-mono text-slate-200">{confidencePct}%</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isBlocked
                  ? "bg-rose-500 shadow-lg shadow-rose-500/50"
                  : isSafe
                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                    : "bg-slate-700"
              }`}
              style={{ width: `${confidencePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs mt-2">
        <div className="bg-black/40 rounded-xl p-3 border border-white/10">
          <div className="text-slate-400 text-[11px] mb-1">Detection Layer</div>
          <div
            className={`font-semibold ${
              isBlocked
                ? "text-rose-300"
                : isSafe
                  ? "text-emerald-300"
                  : "text-slate-400"
            }`}
          >
            {result?.detection_layer || "—"}
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-3 border border-white/10">
          <div className="text-slate-400 text-[11px] mb-1">Attack Category</div>
          <div
            className={`font-semibold ${
              isBlocked ? "text-rose-300" : "text-slate-400"
            }`}
          >
            {result?.attack_type || "—"}
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-3 border border-white/10">
          <div className="text-slate-400 text-[11px] mb-1">Risk Profile</div>
          <div className="font-semibold text-slate-200 uppercase">
            {result?.risk_level || "BALANCED"}
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-3 border border-white/10">
          <div className="text-slate-400 text-[11px] mb-1">Agent Action</div>
          <div
            className={`font-semibold ${
              isBlocked
                ? "text-amber-400"
                : isSafe
                  ? "text-emerald-400"
                  : "text-slate-400"
            }`}
          >
            {isBlocked ? "Suppressed (0 Call)" : isSafe ? "Executed" : "—"}
          </div>
        </div>
      </div>
    </div>
  )
}
