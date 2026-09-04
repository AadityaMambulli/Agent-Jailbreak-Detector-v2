import React from "react"
import { BarChart3 } from "lucide-react"

interface Props {
  total: number
  blocked: number
  safe: number
  avgLatency: string
}

export const QuickStats: React.FC<Props> = ({
  total,
  blocked,
  safe,
  avgLatency,
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Session Telemetry
            </h3>
            <p className="text-[11px] text-slate-400">
              Live counters for current demo run
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-slate-400">Total Inspections</span>
            <span className="font-mono text-sm font-semibold text-white">
              {total}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
            <span className="text-rose-300">Threats Blocked</span>
            <span className="font-mono text-sm font-semibold text-rose-400">
              {blocked}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
            <span className="text-emerald-300">Safe Requests Executed</span>
            <span className="font-mono text-sm font-semibold text-emerald-400">
              {safe}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="text-slate-400">Average Processing Latency</span>
        <span className="font-mono text-sm font-bold text-red-400">
          {avgLatency}ms
        </span>
      </div>
    </div>
  )
}
