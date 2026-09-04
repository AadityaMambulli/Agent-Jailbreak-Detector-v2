"""Audit logger for tracking, storing, and analyzing jailbreak decisions with full explainability."""

import json
import logging
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional


class AuditLogger:
    def __init__(self, log_file: str | Path = "audit_logs.jsonl"):
        self.log_path = Path(log_file)
        self.logger = logging.getLogger("AuditLogger")

        # Ensure parent directory exists if a path is provided
        if self.log_path.parent:
            self.log_path.parent.mkdir(parents=True, exist_ok=True)

    def _redact_sensitive_data(self, text: str) -> str:
        """Redact credit card numbers, CVVs, and sensitive credentials from logs."""
        if not text:
            return ""
        # Redact 13-19 digit card numbers
        redacted = re.sub(r"\b(?:\d[ -]*?){13,19}\b", "[REDACTED_CARD_NUMBER]", text)
        # Redact CVVs in key-value context
        redacted = re.sub(r"(?i)\b(cvv|cvc|pin|password)\s*[:=]\s*\d+\b", r"\1:[REDACTED]", redacted)
        return redacted

    def log_decision(
        self,
        input_text: str,
        classification_result: Dict[str, Any],
        action_taken: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Record an explainable audit trail event in structured JSONL format."""
        entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "input": self._redact_sensitive_data(input_text),
            "classification": classification_result.get("status", "unknown"),
            "confidence": classification_result.get("confidence", 0.0),
            "ml_score": classification_result.get("ml_score", 0.0),
            "rule_score": classification_result.get("rule_score", 0.0),
            "attack_type": classification_result.get("attack_type", "none"),
            "action": action_taken,
            "risk_level": classification_result.get("risk_level", "balanced"),
            "threshold_applied": classification_result.get("threshold_applied", 0.60),
            "metadata": metadata or {},
        }

        try:
            with open(self.log_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry) + "\n")
        except IOError as e:
            self.logger.error(f"Failed to write audit log to {self.log_path}: {e}")

        return entry

    def read_recent_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Read the most recent decision logs."""
        if not self.log_path.exists():
            return []
        
        logs = []
        try:
            with open(self.log_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line:
                        logs.append(json.loads(line))
            return logs[-limit:]
        except Exception as e:
            self.logger.error(f"Failed to read audit logs: {e}")
            return []
