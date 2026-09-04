export interface Preset {
  id: string
  name: string
  icon?: string
  type: "benign" | "attack"
  prompt: string
  payload: Record<string, any>
}

export interface SecurityStatus {
  status: string
  confidence: number
  attack_type: string
}

export interface InspectResponse {
  status: "success" | "blocked" | "pending_review"
  reason?: string
  attack_type: string
  confidence: number
  risk_level: string
  threshold_applied: number
  detection_layer?: string
  agent_response?: Record<string, any>
  security?: SecurityStatus
}

export interface AuditLogEntry {
  timestamp: string
  input: string
  classification: "jailbreak" | "legitimate" | "pending_review"
  confidence: number
  ml_score?: number
  rule_score?: number
  attack_type: string
  action: "blocked" | "allowed" | "pending_review"
  risk_level: string
  threshold_applied: number
  metadata?: Record<string, any>
}

export interface LiveMetrics {
  precision: number
  recall: number
  f1: number
  total_evaluated: number
  risk_level: string
  threshold: number
  error?: string
}
