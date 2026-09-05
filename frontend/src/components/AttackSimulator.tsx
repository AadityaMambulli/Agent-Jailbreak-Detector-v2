import React, { useState } from "react"
import { Terminal, Zap, Loader2, Braces } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Preset } from "@/lib/types"

interface Props {
  presets: Preset[]
  selectedPresetId: string | null
  onSelectPreset: (preset: Preset) => void
  prompt: string
  onPromptChange: (val: string) => void
  payloadStr: string
  onPayloadChange: (val: string) => void
  onExecute: () => void
  loading: boolean
}

export const AttackSimulator: React.FC<Props> = ({
  presets,
  selectedPresetId,
  onSelectPreset,
  prompt,
  onPromptChange,
  payloadStr,
  onPayloadChange,
  onExecute,
  loading,
}) => {
  const [jsonError, setJsonError] = useState<string | null>(null)

  const handleFormat = () => {
    try {
      const obj = JSON.parse(payloadStr)
      onPayloadChange(JSON.stringify(obj, null, 2))
      setJsonError(null)
    } catch {
      setJsonError("Invalid JSON syntax")
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono text-[10px] font-bold tracking-widest text-red-400 uppercase mb-0.5">
                01 // ATTACK SIMULATION
              </div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Attack Simulator & Testbench
              </h3>
              <p className="text-[11px] text-slate-400">
                Craft or inject adversarial payloads into agent pipeline
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
            SANDBOX
          </span>
        </div>

        {/* Preset Chips */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-slate-400 mb-2.5 block">
            Demo Scenarios
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => {
              const isSelected = selectedPresetId === preset.id
              const isBenign = preset.type === "benign"

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? isBenign
                        ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-300 ring-2 ring-emerald-500/30"
                        : "bg-rose-500/20 border-rose-400/60 text-rose-300 ring-2 ring-rose-500/30"
                      : isBenign
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                        : "bg-rose-500/5 border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                  }`}
                >
                  <span>{preset.icon || (isBenign ? "🟢" : "🛑")}</span>
                  <span>{preset.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
            User Prompt Input
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Type customer message or jailbreak prompt..."
            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 resize-none transition"
          />
        </div>

        {/* Payload JSON */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <span>Downstream Payload</span>
              <span className="font-mono text-[10px] text-slate-500">(JSON)</span>
            </label>
            <button
              type="button"
              onClick={handleFormat}
              className="text-[11px] text-red-400 hover:text-red-300 transition flex items-center gap-1 cursor-pointer"
            >
              <Braces className="w-3 h-3" />
              <span>Format</span>
            </button>
          </div>
          <textarea
            rows={3}
            value={payloadStr}
            onChange={(e) => {
              onPayloadChange(e.target.value)
              if (jsonError) setJsonError(null)
            }}
            placeholder='{"action": "apply_discount", "amount": 1500}'
            className={`w-full rounded-xl bg-black/40 border px-4 py-3 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:ring-1 resize-none transition ${
              jsonError
                ? "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/50"
                : "border-white/10 focus:border-red-500 focus:ring-red-500/50"
            }`}
          />
          {jsonError && (
            <span className="text-[11px] text-rose-400 mt-1 block">
              {jsonError}
            </span>
          )}
        </div>
      </div>

      {/* Intercept Button */}
      <Button
        type="button"
        variant="gradient"
        size="lg"
        disabled={loading || !prompt.trim()}
        onClick={onExecute}
        className="w-full font-semibold shadow-red-500/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Intercepting & Evaluating...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            <span>Intercept & Execute Gateway</span>
          </>
        )}
      </Button>
    </div>
  )
}
