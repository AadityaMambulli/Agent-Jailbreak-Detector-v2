import { useState, useEffect } from "react"
import { Zap } from "lucide-react"
import { Logo } from "@/components/Logo"
import { MetricsStrip } from "@/components/MetricsStrip"
import { AttackSimulator } from "@/components/AttackSimulator"
import { ThreatPanel } from "@/components/ThreatPanel"
import { AgentResponse } from "@/components/AgentResponse"
import { QuickStats } from "@/components/QuickStats"
import { AuditTrail } from "@/components/AuditTrail"
import {
  fetchPresets,
  inspectRequest,
  fetchAuditLogs,
  fetchMetrics,
} from "@/lib/api"
import type {
  Preset,
  InspectResponse,
  AuditLogEntry,
  LiveMetrics,
} from "@/lib/types"

// Constants
const GITHUB_URL = "https://github.com/AadityaMambulli/Agent-Jailbreak-Detector-v2"
const RAZORPAY_URL = "https://razorpay.com"

// Shared header component
function Header({ currentPage }: { currentPage: "landing" | "sandbox" }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0d]/80 backdrop-blur-2xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={32} withWordmark={true} />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-300 hover:text-red-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href={RAZORPAY_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-300 hover:text-red-400 transition-colors"
          >
            Razorpay
          </a>
          <a
            href="#/sandbox"
            className={`text-sm transition-colors ${
              currentPage === "sandbox"
                ? "text-red-400"
                : "text-slate-300 hover:text-red-400"
            }`}
          >
            Live Sandbox
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          aria-label="Toggle navigation"
        >
          <span className={`block w-5 h-0.5 bg-slate-300 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-slate-300 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-slate-300 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        <div className="w-20 hidden md:block" />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0d]/95 backdrop-blur-2xl">
          <div className="flex flex-col px-6 py-4 gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-300 hover:text-red-400 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              GitHub
            </a>
            <a
              href={RAZORPAY_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-300 hover:text-red-400 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Razorpay
            </a>
            <a
              href="#/sandbox"
              className={`text-sm transition-colors ${
                currentPage === "sandbox"
                  ? "text-red-400"
                  : "text-slate-300 hover:text-red-400"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Live Sandbox
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

// Landing Page Component
function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white relative overflow-x-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-red-900/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-950/10 rounded-full blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Header currentPage="landing" />

      <main className="relative z-10 pt-32 pb-16 px-6">
        <section className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs mb-6 shadow-inner">
            <Zap className="w-3.5 h-3.5 text-red-400" />
            <span className="text-slate-300">
              Autonomous Financial Agent Protection Layer
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-red-100 to-red-300 mb-4">
            Real-Time Agentic Jailbreak Interceptor
          </h1>

          {/* Subtext */}
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-normal mb-6">
            Deterministic rule heuristics + TF-IDF Machine Learning defending
            autonomous payment tools from prompt injection, role confusion, and
            constraint escape.
          </p>

          {/* Explainer */}
          <p className="text-slate-500 text-sm max-w-xl mx-auto mb-10 leading-relaxed">
            Agentic Shield sits in front of your autonomous payment agent,
            analyzing every prompt in real time before it reaches your AI. It
            detects and blocks prompt injection, role impersonation, and
            constraint-escape attacks using a hybrid rule-engine + ML approach —
            stopping malicious inputs before they can execute any financial action.
          </p>

          {/* CTA Button */}
          <a
            href="#/sandbox"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white font-semibold shadow-lg shadow-red-500/25 hover:from-red-500 hover:to-red-700 transition-all"
          >
            Enter Live Sandbox
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </section>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 relative z-10">
        <p>
          Razorpay Buildathon 2026 • Track 5: Open Track • Dual-Layer
          Deterministic Heuristics &amp; TF-IDF ML Pipeline
        </p>
      </footer>
    </div>
  )
}

// Live Sandbox Page Component
function LiveSandboxPage() {
  const [presets, setPresets] = useState<Preset[]>([])
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [prompt, setPrompt] = useState<string>("")
  const [payloadStr, setPayloadStr] = useState<string>("")

  const [inspectResult, setInspectResult] = useState<InspectResponse | null>(null)
  const [lastDuration, setLastDuration] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const [metrics, setMetrics] = useState<LiveMetrics | null>(null)
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [logsLoading, setLogsLoading] = useState<boolean>(false)

  const [stats, setStats] = useState({
    total: 0,
    blocked: 0,
    safe: 0,
    latencies: [] as number[],
  })

  useEffect(() => {
    async function init() {
      const [presetsList, initialMetrics, initialLogs] = await Promise.all([
        fetchPresets(),
        fetchMetrics(),
        fetchAuditLogs(10),
      ])
      setPresets(presetsList)
      setMetrics(initialMetrics)
      setLogs(initialLogs)

      if (presetsList.length > 0) {
        selectPreset(presetsList[0])
      }
    }
    init()
  }, [])

  const selectPreset = (preset: Preset) => {
    setSelectedPresetId(preset.id)
    setPrompt(preset.prompt)
    setPayloadStr(JSON.stringify(preset.payload, null, 2))
  }

  const handleExecute = async () => {
    let payloadObj: Record<string, any> = {}
    try {
      if (payloadStr.trim()) {
        payloadObj = JSON.parse(payloadStr)
      }
    } catch {
      alert("Payload must be valid JSON")
      return
    }

    setLoading(true)
    const startTime = performance.now()

    try {
      const res = await inspectRequest(prompt, payloadObj)
      const duration = (performance.now() - startTime).toFixed(2)
      setLastDuration(duration)
      setInspectResult(res)

      setStats((prev) => {
        const isBlocked = res.status === "blocked"
        const nextLat = [...prev.latencies, parseFloat(duration)]
        return {
          total: prev.total + 1,
          blocked: prev.blocked + (isBlocked ? 1 : 0),
          safe: prev.safe + (isBlocked ? 0 : 1),
          latencies: nextLat,
        }
      })

      refreshLogs()
    } catch (err: any) {
      alert(`Interception request failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const refreshLogs = async () => {
    setLogsLoading(true)
    const fresh = await fetchAuditLogs(10)
    setLogs(fresh)
    setLogsLoading(false)
  }

  const avgLatency =
    stats.latencies.length > 0
      ? (
          stats.latencies.reduce((a, b) => a + b, 0) / stats.latencies.length
        ).toFixed(2)
      : "0.00"

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-red-500/30 selection:text-white relative overflow-x-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-red-900/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-950/10 rounded-full blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Header currentPage="sandbox" />

      <main className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto">
        {/* Live Metrics KPI Strip */}
        <MetricsStrip
          metrics={metrics}
          sessionAvgLatency={avgLatency}
        />

        {/* Bento Grid: Attack Simulator + Threat Panel */}
        <section id="demo" className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          <div className="lg:col-span-7 flex flex-col">
            <AttackSimulator
              presets={presets}
              selectedPresetId={selectedPresetId}
              onSelectPreset={selectPreset}
              prompt={prompt}
              onPromptChange={setPrompt}
              payloadStr={payloadStr}
              onPayloadChange={setPayloadStr}
              onExecute={handleExecute}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <ThreatPanel
              result={inspectResult}
              lastDuration={lastDuration}
              loading={loading}
            />
          </div>
        </section>

        {/* Secondary Row: Gateway JSON Output + Session Telemetry */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          <div className="lg:col-span-8">
            <AgentResponse response={inspectResult} />
          </div>
          <div className="lg:col-span-4">
            <QuickStats
              total={stats.total}
              blocked={stats.blocked}
              safe={stats.safe}
              avgLatency={avgLatency}
            />
          </div>
        </section>

        {/* Audit Trail Section */}
        <AuditTrail
          logs={logs}
          onRefresh={refreshLogs}
          loading={logsLoading}
        />
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 relative z-10 bg-[#0a0a0c]">
        <p>
          Razorpay Buildathon 2026 • Track 5: Open Track • Dual-Layer
          Deterministic Heuristics &amp; TF-IDF ML Pipeline
        </p>
      </footer>
    </div>
  )
}

// Main App with hash-based routing
export function App() {
  const [route, setRoute] = useState<"landing" | "sandbox">("landing")

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === "#/sandbox") {
        setRoute("sandbox")
      } else {
        setRoute("landing")
      }
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return route === "sandbox" ? <LiveSandboxPage /> : <LandingPage />
}

export default App