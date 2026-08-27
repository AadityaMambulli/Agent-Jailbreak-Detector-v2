"""Secure agent wrapper integrating jailbreak detector and audit logging before payment agent execution."""

from typing import Dict, Any, Optional
from detector.classifier import JailbreakClassifier
from detector.audit_logger import AuditLogger
from .payment_agent import MockPaymentAgent


class SecurePaymentAgentWrapper:
    def __init__(
        self,
        agent: Optional[MockPaymentAgent] = None,
        classifier: Optional[JailbreakClassifier] = None,
        logger: Optional[AuditLogger] = None,
    ):
        self.agent = agent or MockPaymentAgent()
        self.classifier = classifier or JailbreakClassifier()
        self.logger = logger or AuditLogger()

    def _extract_all_text_inputs(self, message: str, payload: Dict[str, Any]) -> str:
        """Extract and combine all potential user-controlled text strings from the request payload."""
        texts = [message] if message else []

        # Inspect nested or supplementary payload text fields where prompt smuggling might lurk
        for key in ["notes", "comment", "comments", "instructions", "message", "reason", "description", "custom_fields"]:
            val = payload.get(key)
            if isinstance(val, str) and val.strip() and val != message:
                texts.append(val)
            elif isinstance(val, dict):
                for sub_k, sub_v in val.items():
                    if isinstance(sub_v, str) and sub_v.strip():
                        texts.append(sub_v)

        return " \n ".join(texts)

    def handle_request(self, message: str, payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Intercept untrusted input, classify for jailbreaks and prompt injections, log decision, and route safely."""
        payload = payload or {}
        metadata = payload.get("metadata", {})

        # Step 1: Aggregate text to prevent prompt smuggling inside payload fields
        combined_text = self._extract_all_text_inputs(message, payload)

        # Step 2: Classify with Hybrid Detector
        detection = self.classifier.classify(combined_text, metadata=metadata)

        # Step 3: Policy Enforcement
        if detection["is_jailbreak"]:
            action_taken = "blocked"
            self.logger.log_decision(
                input_text=message or combined_text,
                classification_result=detection,
                action_taken=action_taken,
                metadata=metadata,
            )
            # Crucial: Return immediately without delegating to self.agent
            return {
                "status": "blocked",
                "reason": "Security Alert: Adversarial prompt injection or policy violation detected.",
                "attack_type": detection["attack_type"],
                "confidence": detection["confidence"],
                "risk_level": detection["risk_level"],
                "threshold_applied": detection["threshold_applied"],
            }

        # Step 4: Safe execution via Payment Agent
        action_taken = "allowed"
        self.logger.log_decision(
            input_text=message or combined_text,
            classification_result=detection,
            action_taken=action_taken,
            metadata=metadata,
        )
        agent_response = self.agent.process_payment_request(payload)
        return {
            "status": "success",
            "agent_response": agent_response,
            "security": {
                "status": "cleared",
                "confidence": detection["confidence"],
                "attack_type": "none",
            },
        }
