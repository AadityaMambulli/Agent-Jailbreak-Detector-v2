import React from "react"
import { Code2, Copy, Check } from "lucide-react"

interface Props {
  response: Record<string, any> | null
}

export const AgentResponse: React.FC<Props> = ({ response }) => {
  const [copied, setCopied] = React.useState(false)

  const text = response
    ? JSON.stringify(response, null, 2)
    : '// Awaiting interception...\n{\n  "status": "idle"\n}'

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Agent Gateway Output
            </h3>
            <p className="text-[11px] text-slate-400">
              Live response returned to client
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="bg-black/50 rounded-xl p-4 text-xs font-mono text-slate-200 border border-white/10 overflow-x-auto max-h-56 scrollbar-thin scrollbar-thumb-white/10 leading-relaxed">
        {text}
      </pre>
    </div>
  )
}
