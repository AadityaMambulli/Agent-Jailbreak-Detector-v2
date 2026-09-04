import React from "react"
import { FileText, RefreshCw } from "lucide-react"
import type { AuditLogEntry } from "@/lib/types"

interface Props {
  logs: AuditLogEntry[]
  onRefresh: () => void
  loading: boolean
}

export const AuditTrail: React.FC<Props> = ({ logs, onRefresh, loading }) => {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Audit Trail (Redacted JSONL)
            </h3>
            <p className="text-[11px] text-slate-400">
              Immutable PCI-DSS compliant log stream with PCI/CVV masking
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-xs text-left">
          <thead className="bg-black/60 text-slate-400 border-b border-white/10 uppercase tracking-wider font-semibold text-[10px]">
            <tr>
              <th className="py-3 px-4">Time (UTC)</th>
              <th className="py-3 px-4">Verdict</th>
              <th className="py-3 px-4">Risk Profile</th>
              <th className="py-3 px-4">Attack Category</th>
              <th className="py-3 px-4">Sanitized Input Preview</th>
              <th className="py-3 px-4">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[11px]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 font-sans text-xs">
                  No audit trail events recorded yet
                </td>
              </tr>
            ) : (
              logs.map((log, idx) => {
                const verdict =
                  log.action === "pending_review" || log.classification === "pending_review"
                    ? "pending"
                    : log.action === "blocked" || log.classification === "jailbreak"
                      ? "blocked"
                      : "allowed"
                const time = log.timestamp
                  ? log.timestamp.split("T")[1]?.split(".")[0] || log.timestamp
                  : "—"
                const preview =
                  log.input.length > 50
                    ? `${log.input.substring(0, 50)}...`
                    : log.input || "—"
                const conf =
                  typeof log.confidence === "number"
                    ? `${(log.confidence * 100).toFixed(1)}%`
                    : "—"

                return (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {time}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          verdict === "blocked"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : verdict === "pending"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {log.action || log.classification}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 uppercase">
                      {log.risk_level || "BALANCED"}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-sans">
                      {log.attack_type || "none"}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate" title={log.input}>
                      {preview}
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-semibold">
                      {conf}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
