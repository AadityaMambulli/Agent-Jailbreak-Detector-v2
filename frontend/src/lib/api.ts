import type { Preset, InspectResponse, AuditLogEntry, LiveMetrics } from "./types"

export async function fetchPresets(): Promise<Preset[]> {
  try {
    const res = await fetch("/api/presets")
    if (!res.ok) throw new Error(`Presets error: ${res.statusText}`)
    const data = await res.json()
    return data.presets || []
  } catch (err) {
    console.error("fetchPresets failed:", err)
    return []
  }
}

export async function inspectRequest(
  prompt: string,
  payload: Record<string, any>
): Promise<InspectResponse> {
  const res = await fetch("/api/inspect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, payload }),
  })
  if (!res.ok) {
    throw new Error(`Inspect API failed: ${res.statusText}`)
  }
  return res.json()
}

export async function fetchAuditLogs(limit: number = 10): Promise<AuditLogEntry[]> {
  try {
    const res = await fetch(`/api/logs?limit=${limit}`)
    if (!res.ok) throw new Error(`Logs error: ${res.statusText}`)
    const data = await res.json()
    return data.logs || []
  } catch (err) {
    console.error("fetchAuditLogs failed:", err)
    return []
  }
}

export async function fetchMetrics(): Promise<LiveMetrics | null> {
  try {
    const res = await fetch("/api/metrics")
    if (!res.ok) throw new Error(`Metrics error: ${res.statusText}`)
    return res.json()
  } catch (err) {
    console.error("fetchMetrics failed:", err)
    return null
  }
}
